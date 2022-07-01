import { Sequelize } from 'sequelize';

import { DB_CONFIG } from '../configs/global.config';

export const sequelize = new Sequelize(
	DB_CONFIG.NAME, DB_CONFIG.USER, DB_CONFIG.PASSWORD, {
		host: DB_CONFIG.HOST,
		dialect: DB_CONFIG.dialect,
		pool: DB_CONFIG.pool,
		logging: DB_CONFIG.DEBUG ? console.log : false,
	}
);

// Import models
export { User, Class } from './user.models';
export { Contest } from './contest.models';
