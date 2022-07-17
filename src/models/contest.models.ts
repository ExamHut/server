import {  DataTypes, Model } from 'sequelize';

import { sequelize, User, Class } from '@vulcan/models';

export class Contest extends Model {
    declare id: number;
    declare name: string;
    declare description: string;
    declare startDate: Date;
    declare endDate: Date;
}

Contest.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    sequelize,
});

class ContestParticipation extends Model {
    declare id: number;
    declare contestId: number;
}

ContestParticipation.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    points: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: -1, // In case the contestant is disqualified
        },
    },
    participateCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    disqualified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
},{
    sequelize,
});

// Relationships
Contest.belongsTo(User, { as: 'author' });
Contest.belongsTo(Class, { as: 'class' });

ContestParticipation.belongsTo(User, { as: 'user' });
ContestParticipation.belongsTo(Contest, { as: 'contest' });
