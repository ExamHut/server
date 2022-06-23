import {  DataTypes, Model } from 'sequelize';

import { sequelize } from '@vulcan/models';

export class User extends Model {}

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

export class Class extends Model {}

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
})

class UserClass extends Model {}

UserClass.init({}, {
    sequelize,
    timestamps: false,
    tableName: 'UserClass',
});

// Setup associations
User.belongsToMany(Class, { through: 'UserClass' });
Class.belongsToMany(User, { through: 'UserClass' });
