import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from './user.models';

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: process.env.DB_FORCED_SYNC === "true",
    logging: false,
    entities: [__dirname + "/**/*.models.ts"],
    migrations: [],
    subscribers: [],
});

export { User, Class } from './user.models';
export { Contest, ContestParticipation } from './contest.models';
export { Problem, ContestProblem } from './problem.models';
export { Language, Judge, RuntimeVersion } from './runtime.models';
export { Submission, SubmissionSource, SubmissionTestcase } from './submission.models';
