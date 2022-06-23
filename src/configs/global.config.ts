/**
 * Global configuration.
 *
 * This file contains variables that are configurable and will be used globally.
 *
 * Another configuration file should be created by the users themselves, contains their local settings.
 */

import * as fs from 'fs';

import { Dialect } from 'sequelize';

let CONFIG_DIR = [
    '/etc/vulcan/config.json',
    './src/configs/local.config.json', // Local configuration. Dev only.
];

let LOCAL_CONFIG: any = null;

for (const dir of CONFIG_DIR) {
    if (fs.existsSync(dir)) {
        try {
            LOCAL_CONFIG = JSON.parse(fs.readFileSync(dir, 'utf-8'));
        } catch (e) { LOCAL_CONFIG = null; }
    }
}

interface DB_CONFIG_INTERFACE {
    NAME: string,
    HOST: string,
    USER: string,
    PASSWORD: string,
    DEBUG: boolean,
    dialect: Dialect,
    pool: object,
}

export const HOST_CONFIG = {
    HOST: LOCAL_CONFIG.HOST_CONFIG.HOST || 'localhost',
    PORT: LOCAL_CONFIG.HOST_CONFIG.PORT || 8080,
}

export const DB_CONFIG: DB_CONFIG_INTERFACE = {
    NAME: LOCAL_CONFIG.DB_CONFIG.NAME || 'vulcan',
    HOST: LOCAL_CONFIG.DB_CONFIG.HOST || 'localhost',
    USER: LOCAL_CONFIG.DB_CONFIG.USER || 'root',
    PASSWORD: LOCAL_CONFIG.DB_CONFIG.PASSWORD || '',
    DEBUG: LOCAL_CONFIG.DB_CONFIG.DEBUG || false,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};
