import {  DataTypes, Model } from 'sequelize';

import { sequelize, User, Class } from '@vulcan/models';

export class Contest extends Model {}

Contest.init({
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

Contest.belongsTo(User, { as: 'author' });
Contest.belongsTo(Class, { as: 'class' });
