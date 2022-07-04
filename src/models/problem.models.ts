import {  DataTypes, Model } from 'sequelize';

import { sequelize, Contest } from '@vulcan/models';

export class Problem extends Model {}

Problem.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    statementFile: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    timeLimit: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    memoryLimit: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize,
});

export class ContestProblem extends Model {}

ContestProblem.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    points: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
});

ContestProblem.belongsTo(Problem, { as: "problem" });
ContestProblem.belongsTo(Contest, { as: "contest" });
