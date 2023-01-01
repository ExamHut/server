import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, ManyToMany, ManyToOne, JoinTable, CreateDateColumn, Relation, OneToMany, Unique, JoinColumn } from "typeorm";

import { Contest, Language, Submission } from "@vulcan/models";

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
    allowedLanguages: Relation<Language>[];

    @OneToMany('Submission', (submission: Relation<Submission>) => submission.problem, { onDelete: 'CASCADE' })
    submissions: Promise<Relation<Submission>[]>;

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

    @OneToMany('ContestProblem', (contest_problem: Relation<ContestProblem>) => contest_problem.problem, { onDelete: 'CASCADE' })
    contest_problems: Promise<Relation<ContestProblem>[]>;
}

@Entity()
@Unique(['problem', 'contest'])
export class ContestProblem extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    points: number;

    @ManyToOne('Problem', (problem: Relation<Problem>) => problem.contest_problems, { onDelete: 'CASCADE' })
    @JoinColumn()
    problem: Promise<Relation<Problem>>;

    @ManyToOne('Contest', (contest: Relation<Contest>) => contest.problems, { onDelete: 'CASCADE' })
    @JoinColumn()
    contest: Promise<Relation<Contest>>;

    @OneToMany('Submission', (submission: Relation<Submission>) => submission.contest_problem, { onDelete: 'CASCADE' })
    submissions: Promise<Relation<Submission>[]>;
}
