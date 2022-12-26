import crypto from "crypto";
import fs from "fs";
import multer from "multer";

import { Request, Response } from 'express';
import { AppDataSource, Language, Problem, Submission, User } from "@vulcan/models";
import { SubmissionSource } from 'src/models/submission.models';

export async function submissionInfo(req: Request, res: Response) {
    let submission = await Submission.findOne({
        relations: ["user", "problem"],
        where: {
            id: Number(req.params.submissionId),
        },
    });

    return res.status(200).json({
        id: submission.id,
        problem_id: submission.problem.id,
        user_id: submission.user.id,
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
        is_pretested: submission.isPretested,
    });
}

export async function allSubmissionInfo(req: Request, res: Response) {
    const submissions = await Submission.find({
        relations: ["user", "problem"],
        where: {
            problem: {
                id: Number(req.params.problemId),
            },
        },
    });

    return res.status(200).json(Array.from(submissions, (submission) => {
        return {
            id: submission.id,
            problem_id: submission.problem.id,
            user_id: submission.user.id,
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
            is_pretested: submission.isPretested,
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
    upload(req, res, async (err) => {
        if (err) {
            return res.status(409).json(err);
        }

        const problem = await Problem.findOneBy({ id: Number(req.params.problemId) });
        const language = await Language.findOneBy({ extension: req.body.language });
        const user = req.user;

        const submission = new Submission();
        submission.user = user;
        submission.problem = problem;
        submission.date = new Date();
        submission.language = language;
        const updatedSubmisison = await submission.save();

        const submissionSource = new SubmissionSource();
        submissionSource.submission = updatedSubmisison;

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
            submissionSource.source = req.body.source;
        }

        submissionSource.save();

        return res.status(200).end();
    });
}

export async function source(req: Request, res: Response) {
    const submisisonSource = await SubmissionSource.findOne({
        relations: ["submission"],
        where: {
            submission: {
                id: Number(req.params.submissionId),
            },
        },
    });

    return res.status(200).json({ source: submisisonSource.source });
}
