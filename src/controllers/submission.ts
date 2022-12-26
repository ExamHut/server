import { Request, Response } from 'express';
import { Submission } from "@vulcan/models";

export async function submissionInfo(req: Request, res: Response) {
    let submission = await Submission.findOne({
        relations: {
            user: true,
            problem: true,
        },
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
    let submissions = await Submission.find({
        relations: {
            user: true,
            problem: true,
        },
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
