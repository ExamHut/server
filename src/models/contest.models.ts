import { DataType, Model, ForeignKey, Column, Table, BelongsTo } from 'sequelize-typescript'

import { sequelize, User, Class } from '@vulcan/models';

@Table
export class Contest extends Model {
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

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    description: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    startDate: Date;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    endDate: Date;

    @ForeignKey(() => User)
    @Column
    authorId: number;

    @ForeignKey(() => Class)
    @Column
    classId: number;

    @BelongsTo(() => User)
    author: User;

    @BelongsTo(() => Class)
    class: Class;
}

@Table
export class ContestParticipation extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id: number;

    @Column({
        type: DataType.FLOAT,
        allowNull: false,
    })
    points: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
    })
    participateCount: number;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    disqualified: boolean;

    @ForeignKey(() => User)
    @Column
    userId: number;

    @ForeignKey(() => Contest)
    @Column
    contestId: number;

    @BelongsTo(() => User)
    user: User;

    @BelongsTo(() => Contest)
    contest: Contest;
}

sequelize.addModels([Contest, ContestParticipation]);