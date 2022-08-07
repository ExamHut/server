import * as bcrypt from 'bcrypt';
import { DataType, Table, Column, Model, BelongsToMany, ForeignKey, HasMany } from 'sequelize-typescript';

import { sequelize, Contest } from '@vulcan/models';

@Table({
    hooks: {
        beforeCreate: (user: User, options) => {
            if (user.password) {
                user.password = User.hashPassword(user.password);
            }
        },
        beforeUpdate: (user: User, options) => {
            if (user.changed('password')) {
                user.password = User.hashPassword(user.password);
            }
        },
    },
})

export class User extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    username: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    refreshToken: string;

    @BelongsToMany(() => Class, () => UserClassJoin)
    classes: Class[];

    static hashPassword(password: string) : string {
        return bcrypt.hashSync(password, 10);
    }

    verifyPassword(password: string) {
        return bcrypt.compareSync(password, this.password);
    }
}

@Table
export class Class extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    code: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @BelongsToMany(() => User, () => UserClassJoin)
    users: User[];
}

@Table
class UserClassJoin extends Model {
    @ForeignKey(() => User)
    @Column
    userId: number;

    @ForeignKey(() => Class)
    @Column
    classId: number;
}

sequelize.addModels([User, Class, UserClassJoin]);
