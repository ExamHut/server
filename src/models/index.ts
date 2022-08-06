import { Sequelize } from 'sequelize-typescript';

export const sequelize = new Sequelize(
	process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
		host: process.env.DB_HOST,
		dialect: "mysql",
		pool: {
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 10000,
		},
		logging: process.env.DB_DEBUG === "true" ? console.log : false,
	}
);

// Import models
export { User, Class } from './user.models';
export { Contest } from './contest.models';
export { Problem } from './problem.models';