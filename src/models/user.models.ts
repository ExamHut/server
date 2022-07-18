import {  DataTypes, Model } from 'sequelize';
import * as bcrypt from 'bcrypt';


import { sequelize } from '@vulcan/models';

export class User extends Model {
    declare id: number;
    declare username: string;
    declare name: string;
    declare email: string;
    declare password: string;

    static hashPassword(password: string) : string {
        return bcrypt.hashSync(password, 10);
    }

    verifyPassword(password: string) {
        return bcrypt.compareSync(password, this.password);
    }
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
    hooks: {
        beforeSave: (user: User, options) => {
            if (user.password) {
                user.password = User.hashPassword(user.password);
            }
        },
    },
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
