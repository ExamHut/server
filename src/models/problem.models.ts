import { DataType, Model, Table, Column, ForeignKey, BelongsTo } from 'sequelize-typescript';

import { sequelize, Contest } from '@vulcan/models';

@Table
export class Problem extends Model {
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
    statementFile: string;

    @Column({
        type: DataType.FLOAT,
        allowNull: false,
    })
    timeLimit: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    memoryLimit: number;
}

@Table
export class ContestProblem extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    points: number;

    @ForeignKey(() => Problem)
    @Column
    problemId: number;

    @ForeignKey(() => Contest)
    @Column
    contestId: number;

    @BelongsTo(() => Problem)
    problem: Problem;

    @BelongsTo(() => Contest)
    contest: Contest;
}

sequelize.addModels([Problem, ContestProblem]);