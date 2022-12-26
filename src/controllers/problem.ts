import { Request, Response } from 'express';
import { AppDataSource, Problem, Submission } from "@vulcan/models";

export async function problemInfo(req: Request, res: Response) {
    let problem = await Problem.findOneBy({ id: Number(req.params.problemId) });

    return res.status(200).json({
        id: problem.id,
        code: problem.code,
        name: problem.name,
        statement_file: problem.statementFile,
        time_limit: problem.timeLimit,
        memory_limit: problem.memoryLimit,
    });
}
