import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Unique, OneToOne, JoinColumn, Relation } from "typeorm";

import { User, Problem, Language, Judge, ContestProblem, ContestParticipation } from "@vulcan/models";
import { judge_submission } from "src/judgeapi";

@Entity()
export class Submission extends BaseEntity {
    static SUBMISSION_RESULT = [
        ['AC', 'Accepted'],
        ['WA', 'Wrong Answer'],
        ['TLE', 'Time Limit Exceeded'],
        ['MLE', 'Memory Limit Exceeded'],
        ['OLE', 'Output Limit Exceeded'],
        ['IR', 'Invalid Return'],
        ['RTE', 'Runtime Error'],
        ['CE', 'Compile Error'],
        ['IE', 'Internal Error'],
        ['SC', 'Short circuit'],
        ['AB', 'Aborted'],
    ];

    static SUBMISSION_STATUS = [
        ['QU', 'Queued'],
        ['P', 'Processing'],
        ['G', 'Grading'],
        ['D', 'Completed'],
        ['IE', 'Internal Error'],
        ['CE', 'Compile Error'],
        ['AB', 'Aborted'],
    ];

    static SUBMISSION_SEARCHABLE_RESULT = Submission.SUBMISSION_RESULT.concat([
        ['QU', 'Queued'],
        ['P', 'Processing'],
        ['G', 'Grading'],
        ['D', 'Completed'],
        ['IE', 'Internal Error'],
        ['CE', 'Compile Error'],
    ]);

    static IN_PROGRESS_GRADING_STATUS = ['QU', 'P', 'G'];

    static USER_DISPLAY_CODES = {
        'AC': 'Accepted',
        'WA': 'Wrong Answer',
        'SC': 'Short Circuited',
        'TLE': 'Time Limit Exceeded',
        'MLE': 'Memory Limit Exceeded',
        'OLE': 'Output Limit Exceeded',
        'IR': 'Invalid Return',
        'RTE': 'Runtime Error',
        'CE': 'Compile Error',
        'IE': 'Internal Error (judging server error)',
        'QU': 'Queued',
        'P': 'Processing',
        'G': 'Grading',
        'D': 'Completed',
        'AB': 'Aborted',
    };

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne('User', { onDelete: 'CASCADE' })
    @JoinColumn()
    user: Promise<Relation<User>>;

    @ManyToOne('Problem', (problem: Relation<Problem>) => problem.submissions, { onDelete: 'CASCADE' })
    @JoinColumn()
    problem: Promise<Relation<Problem>>;

    @ManyToOne('ContestProblem', (problem: Relation<ContestProblem>) => problem.submissions, { onDelete: 'CASCADE' })
    @JoinColumn()
    contest_problem: Promise<Relation<ContestProblem>>;

    @ManyToOne('ContestParticipation', { onDelete: 'CASCADE' })
    @JoinColumn()
    participation: Promise<Relation<ContestParticipation>>;

    @CreateDateColumn()
    date: Date;

    @Column({
        type: 'float',
        nullable: true,
    })
    time: number;

    @Column({
        type: 'float',
        nullable: true,
    })
    memory: number;

    @Column({
        type: 'float',
        nullable: true,
    })
    points: number;

    @ManyToOne('Language', { onDelete: 'CASCADE' })
    language: Promise<Relation<Language>>;

    @Column({
        length: 2,
        default: 'QU',
    })
    status: string;

    @Column({
        length: 3,
        default: null,
        nullable: true,
    })
    result: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    error: string;

    @Column({
        default: 0,
    })
    current_testcase: number;

    @Column({
        type: 'float',
        default: 0,
    })
    case_points: number;

    @Column({
        type: 'float',
        default: 0,
    })
    case_total: number;

    @Column({
        default: false,
    })
    batch: boolean;

    @ManyToOne('Judge', { onDelete: 'SET NULL' })
    judged_on: Judge;

    @Column({
        type: 'datetime',
        nullable: true,
    })
    judged_date: Date;

    @Column({
        type: 'datetime',
        nullable: true,
    })
    rejudged_date: Date;

    @Column({
        default: false,
    })
    isPretested: boolean;

    @OneToOne('SubmissionSource', (source: Relation<SubmissionSource>) => source.submission, { onDelete: 'CASCADE' })
    source: Promise<Relation<SubmissionSource>>;

    public async judge(rejudge: boolean = false) {
        return await judge_submission(this);
    }
}

@Entity()
export class SubmissionSource extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne('Submission', (submission: Relation<Submission>) => submission.source, { onDelete: 'CASCADE' })
    @JoinColumn()
    submission: Promise<Relation<Submission>>;

    @Column({
        type: 'text',
    })
    source: string;
}

@Entity()
@Unique(['submission', 'case'])
export class SubmissionTestcase extends BaseEntity {
    static RESULT = Submission.SUBMISSION_RESULT;

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne('Submission', { onDelete: 'CASCADE' })
    submission: Promise<Relation<Submission>>;

    @Column()
    case: number;

    @Column({
        length: 3,
    })
    status: string;

    @Column({
        type: 'float',
        nullable: true,
    })
    time: number;

    @Column({
        type: 'float',
        nullable: true,
    })
    memory: number;

    @Column({
        type: 'float',
        nullable: true,
    })
    points: number;

    @Column({
        type: 'float',
        nullable: true,
    })
    total: number;

    @Column({
        nullable: true,
    })
    batch: number;

    @Column()
    feedback: string;

    @Column({
        type: 'text',
    })
    extended_feedback: string;

    @Column({
        type: 'text',
    })
    output: string;
}
