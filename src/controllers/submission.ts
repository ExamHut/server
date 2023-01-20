import crypto from "crypto";
import fs from "fs";
import multer from "multer";

import { Request, Response } from 'express';
import { Equal } from "typeorm";
import { AppDataSource, ContestParticipation, ContestProblem, Judge, Language, Problem, Submission, SubmissionSource, User } from "@vulcan/models";

export async function submissionInfo(req: Request, res: Response) {
    const submission = await Submission.findOne({
        where: {
            id: Number(req.params.submissionId),
        },
    });

    const problem = await submission.problem;
    const user = await submission.user;

    return res.status(200).json({
        id: submission.id,
        problem_id: problem.id,
        user_id: user.id,
        language: submission.language,
        status: submission.status,
        result: submission.result,
        date: submission.date,
        time: submission.time,
        memory: submission.memory,
        points: submission.points,
        current_testcase: submission.current_testcase,
        error: submission.error,
        case_points: submission.case_points,
        case_total: submission.case_total,
        judged_on: submission.judged_on,
        judged_date: submission.judged_date,
        rejudged_date: submission.rejudged_date,
        is_pretested: (await submission.contest_problem).isPretested,
    });
}

export async function allSubmissionInfo(req: Request, res: Response) {
    const submissions = await Submission.find({
        where: {
            problem: {
                id: Number(req.params.problemId),
            },
        },
    });

    return res.status(200).json(Array.from(submissions, async (submission: Submission) => {
        const problem = await submission.problem;
        const user = await submission.user;

        return {
            id: submission.id,
            problem_id: problem.id,
            user_id: user.id,
            language: submission.language,
            status: submission.status,
            result: submission.result,
            date: submission.date,
            time: submission.time,
            memory: submission.memory,
            points: submission.points,
            current_testcase: submission.current_testcase,
            error: submission.error,
            case_points: submission.case_points,
            case_total: submission.case_total,
            judged_on: submission.judged_on,
            judged_date: submission.judged_date,
            rejudged_date: submission.rejudged_date,
            is_pretested: (await submission.contest_problem).isPretested,
        };
    }));
}

// Handle requests of content-type multipart/form-data
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'storage/');
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    },
});
const upload = multer({ storage: storage }).single('fileonly_submission');

export async function submit(req: Request, res: Response) {
    // Ensure that there is at least one judge available
    if ((await Judge.find({ where: { online: true } })).length === 0) {
        return res.status(400).json({ error: "No judge available." });
    }

    upload(req, res, async (err) => {
        if (err) {
            return res.status(409).json(err);
        }

        const contest_problem = await ContestProblem.findOneBy({ id: Equal(Number(req.params.problemId)) });
        if (!contest_problem) {
            return res.status(404).json({ error: "Problem not found" });
        }

        const contest = await contest_problem.contest;
        const problem = await contest_problem.problem;

        const language = await Language.findOneBy({ code: Equal(req.body.language) });
        if (!language) {
            return res.status(400).json({ error: `Unsupported language: ${req.body.language}` });
        }

        // Ensure that the submission does contains file/source
        if (!req.body.source && !req.file) {
            return res.status(400).json({ error: "No source/file found." });
        }

        const user = req.user;

        // Get the participation of the user
        const participation = await ContestParticipation.findOne({
            order: {
                part_count: "DESC",
            },
            where: {
                contest: {
                    id: Equal(contest.id),
                },
                user: {
                    id: Equal(user.id),
                },
            },
        });

        const submission = new Submission();
        submission.user = Promise.resolve(user);
        submission.problem = Promise.resolve(problem);
        submission.contest_problem = Promise.resolve(contest_problem);
        submission.participation = Promise.resolve(participation);
        submission.date = new Date();
        submission.language = Promise.resolve(language);
        submission.isPretested = contest_problem.isPretested;
        const updatedSubmisison = await submission.save();

        const submissionSource = new SubmissionSource();
        submissionSource.submission = Promise.resolve(updatedSubmisison);

        if (language.fileOnly) {
            const split = req.file.filename.split('.');
            const extension = (split.length > 1) ? ("." + split.pop()) : "";
            const newPath = `storage/${crypto.randomUUID()}${extension}`;
            fs.rename(req.file.path, newPath, (err) => {
                if (err) {
                    return res.status(500).json(err);
                }
            });
            submissionSource.source = newPath;
        } else {
            submissionSource.source = req.body.source.toString('utf8');
        }

        await submissionSource.save();

        const success = await submission.judge();

        if (!success) {
            return res.status(500).json({ error: "Failed to judge submission." });
        } else {
            return res.status(200).end();
        }
    });
}

export async function source(req: Request, res: Response) {
    const submisisonSource = await SubmissionSource.findOne({
        where: {
            submission: {
                id: Number(req.params.submissionId),
            },
        },
    });

    return res.status(200).json({ source: submisisonSource.source });
}
