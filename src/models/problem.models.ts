import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, ManyToMany, ManyToOne, JoinTable, CreateDateColumn, Relation, OneToMany, Unique, JoinColumn, RelationId } from "typeorm";

import { Contest, Language, Submission } from "@vulcan/models";

@Entity()
export class Problem extends BaseEntity {
    @PrimaryGeneratedColumn({
        name: 'id',
    })
    id: number;

    @Column({
        name: 'code',
        length: 64,
        unique: true,
    })
    code: string;

    @Column({
        name: 'name',
        length: 128,
    })
    name: string;

    @Column({
        name: 'statement',
        nullable: true,
    })
    statementFile: string;

    @Column({
        name: 'time_limit',
        type: "float",
        precision: 3,
    })
    timeLimit: number;

    @Column({
        name: 'memory_limit',
    })
    memoryLimit: number;

    @Column({
        name: 'short_circuit',
        default: false,
    })
    shortCircuit: boolean;

    @Column({
        name: 'points',
        type: 'float',
    })
    points: number;

    @Column({
        name: 'partial',
        default: false,
    })
    partial: boolean;

    @ManyToMany('Language', { eager: true })
    @JoinTable({
        name: 'problem_language',
        joinColumn: {
            name: 'problem_id',
        },
        inverseJoinColumn: {
            name: 'language_id',
        },
    })
    allowedLanguages: Relation<Language>[];

    @OneToMany('Submission', (submission: Relation<Submission>) => submission.problem, { onDelete: 'CASCADE' })
    submissions: Promise<Relation<Submission>[]>;

    @Column({
        name: 'is_public',
        default: false,
    })
    isPublic: boolean;

    @Column({
        name: 'is_manually_managed',
        default: false,
    })
    isManuallyManaged: boolean;

    @Column({
        name: 'date',
        type: 'datetime',
        default: () => 'NOW()',
    })
    date: Date;

    @OneToMany('ContestProblem', (contest_problem: Relation<ContestProblem>) => contest_problem.problem, { onDelete: 'CASCADE' })
    contest_problems: Promise<Relation<ContestProblem>[]>;
}

@Entity()
@Unique(['problem', 'contest'])
export class ContestProblem extends BaseEntity {
    @PrimaryGeneratedColumn({
        name: 'id',
    })
    id: number;

    @Column({
        name: 'points',
    })
    points: number;

    @ManyToOne('Problem', (problem: Relation<Problem>) => problem.contest_problems, { onDelete: 'CASCADE' })
    @JoinColumn({
        name: 'problem_id',
    })
    problem: Promise<Relation<Problem>>;

    @RelationId((contest_problem: ContestProblem) => contest_problem.problem)
    @Column({ name: 'problem_id' })
    problemId: number;

    @ManyToOne('Contest', (contest: Relation<Contest>) => contest.problems, { onDelete: 'CASCADE' })
    @JoinColumn({
        name: 'contest_id',
    })
    contest: Promise<Relation<Contest>>;

    @RelationId((contest_problem: ContestProblem) => contest_problem.contest)
    @Column({ name: 'contest_id' })
    contestId: number;

    @OneToMany('Submission', (submission: Relation<Submission>) => submission.contest_problem, { onDelete: 'CASCADE' })
    submissions: Promise<Relation<Submission>[]>;

    @Column({
        name: 'is_pretested',
        default: false,
    })
    isPretested: boolean;
}
