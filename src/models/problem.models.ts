import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, ManyToMany, ManyToOne, JoinTable, CreateDateColumn } from "typeorm";

import { Contest, Language } from "@vulcan/models";

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

    @Column({
        default: false,
    })
    shortCircuit: boolean;

    @Column({
        type: 'float',
    })
    points: number;

    @Column({
        default: false,
    })
    partial: boolean;

    @ManyToMany('Language')
    @JoinTable()
    allowedLanguages: Language[];

    @Column({
        default: false,
    })
    isPublic: boolean;

    @Column({
        default: false,
    })
    isManuallyManaged: boolean;

    @CreateDateColumn()
    date: Date;
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
