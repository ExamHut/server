import "reflect-metadata";
import { DataSource } from "typeorm";
import Redis from "ioredis";

import {
    ContestSubscriber,
    ContestParticipationSubscriber,
} from "./subscribers/contest.subscribers";

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
    subscribers: [ContestSubscriber, ContestParticipationSubscriber],
    cache: {
        type: "ioredis",
    },
});

export const RedisCache = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
    username: process.env.REDIS_USERNAME,
    db: parseInt(process.env.REDIS_DB),
});

export { User, Class } from './user.models';
export { Contest, ContestParticipation } from './contest.models';
export { Problem, ContestProblem } from './problem.models';
export { Language, Judge, RuntimeVersion } from './runtime.models';
export { Submission, SubmissionSource, SubmissionTestcase } from './submission.models';
