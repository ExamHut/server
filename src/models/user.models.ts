import {  DataTypes, Model } from 'sequelize';

import { sequelize } from '@vulcan/models';

export class User extends Model {
    declare id: number;
    declare username: string;
    declare name: string;
    declare email: string;
    declare password: string;
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    timestamps: false,
});

export class Class extends Model {
    declare id: number;
    declare code: string;
    declare name: string;
}

Class.init({
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
}, {
    sequelize,
    timestamps: false,
});

class UserClassJoin extends Model {}

UserClassJoin.init({}, {
    sequelize,
    timestamps: false,
    tableName: 'UserClass',
});

// Relationships
User.belongsToMany(Class, { through: 'UserClassJoin' });
Class.belongsToMany(User, { through: 'UserClassJoin' });
