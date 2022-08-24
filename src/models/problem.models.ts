import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, ManyToMany, ManyToOne } from "typeorm";

import { Contest } from "@vulcan/models";

@Entity()
export class Problem extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 64,
        unique: true,
    })
    code: string;

    @Column({
        length: 128,
    })
    name: string;

    @Column({
        nullable: true,
    })
    statementFile: string;

    @Column({
        type: "float",
        precision: 3,
    })
    timeLimit: number;

    @Column()
    memoryLimit: number;
}

@Entity()
export class ContestProblem extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    points: number;

    @ManyToOne('Problem')
    problem: Problem;

    @ManyToOne('Contest')
    contest: Contest;
}
