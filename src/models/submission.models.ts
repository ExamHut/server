import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Unique, OneToOne, JoinColumn, Relation, RelationId } from "typeorm";

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

    @PrimaryGeneratedColumn({
        name: 'id',
    })
    id: number;

    @ManyToOne('User', { onDelete: 'CASCADE' })
    @JoinColumn({
        name: 'user_id',
    })
    user: Promise<Relation<User>>;

    @RelationId((submission: Submission) => submission.user)
    @Column({ name: 'user_id' })
    user_id: number;

    @ManyToOne('Problem', (problem: Relation<Problem>) => problem.submissions, { onDelete: 'CASCADE' })
    @JoinColumn({
        name: 'problem_id',
    })
    problem: Promise<Relation<Problem>>;

    @RelationId((submission: Submission) => submission.problem)
    @Column({ name: 'problem_id' })
    problem_id: number;

    @ManyToOne('ContestProblem', (problem: Relation<ContestProblem>) => problem.submissions, { onDelete: 'CASCADE' })
    @JoinColumn({
        name: 'contest_problem_id',
    })
    contest_problem: Promise<Relation<ContestProblem>>;

    @RelationId((submission: Submission) => submission.contest_problem)
    @Column({ name: 'contest_problem_id' })
    contest_problem_id: number;

    @ManyToOne('ContestParticipation', { onDelete: 'CASCADE' })
    @JoinColumn({
        name: 'contest_participation_id',
    })
    participation: Promise<Relation<ContestParticipation>>;

    @RelationId((submission: Submission) => submission.participation)
    @Column({ name: 'contest_participation_id' })
    contest_participation_id: number;

    @CreateDateColumn({
        name: 'date',
        type: 'datetime',
    })
    date: Date;

    @Column({
        name: 'time',
        type: 'float',
        nullable: true,
    })
    time: number;

    @Column({
        name: 'memory',
        type: 'float',
        nullable: true,
    })
    memory: number;

    @Column({
        name: 'points',
        type: 'float',
        nullable: true,
    })
    points: number;

    @ManyToOne('Language', { onDelete: 'CASCADE' })
    language: Promise<Relation<Language>>;

    @Column({
        name: 'status',
        length: 2,
        default: 'QU',
    })
    status: string;

    @Column({
        name: 'result',
        length: 3,
        default: null,
        nullable: true,
    })
    result: string;

    @Column({
        name: 'error',
        type: 'text',
        nullable: true,
    })
    error: string;

    @Column({
        name: 'current_testcase',
        default: 0,
    })
    current_testcase: number;

    @Column({
        name: 'case_points',
        type: 'float',
        default: 0,
    })
    case_points: number;

    @Column({
        name: 'case_total',
        type: 'float',
        default: 0,
    })
    case_total: number;

    @Column({
        name: 'batch',
        default: false,
    })
    batch: boolean;

    @ManyToOne('Judge', { onDelete: 'SET NULL' })
    @JoinColumn({
        name: 'judge_id',
    })
    judged_on: Judge;

    @RelationId((submission: Submission) => submission.judged_on)
    @Column({ name: 'judge_id', nullable: true })
    judge_id: number;

    @Column({
        name: 'judged_date',
        type: 'datetime',
        nullable: true,
    })
    judged_date: Date;

    @Column({
        name: 'rejudged_date',
        type: 'datetime',
        nullable: true,
    })
    rejudged_date: Date;

    @Column({
        name: 'is_pretested',
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
    @PrimaryGeneratedColumn({
        name: 'id',
    })
    id: number;

    @OneToOne('Submission', (submission: Relation<Submission>) => submission.source, { onDelete: 'CASCADE' })
    @JoinColumn({
        name: 'submission_id',
    })
    submission: Promise<Relation<Submission>>;

    @RelationId((source: SubmissionSource) => source.submission)
    @Column({ name: 'submission_id' })
    submission_id: number;

    @Column({
        name: 'source',
        type: 'text',
    })
    source: string;
}

@Entity()
@Unique(['submission', 'case'])
export class SubmissionTestcase extends BaseEntity {
    static RESULT = Submission.SUBMISSION_RESULT;

    @PrimaryGeneratedColumn({
        name: 'id',
    })
    id: number;

    @ManyToOne('Submission', { onDelete: 'CASCADE' })
    @JoinColumn({
        name: 'submission_id',
    })
    submission: Promise<Relation<Submission>>;

    @RelationId((testcase: SubmissionTestcase) => testcase.submission)
    @Column({ name: 'submission_id' })
    submission_id: number;

    @Column({
        name: 'case',
    })
    case: number;

    @Column({
        name: 'status',
        length: 3,
    })
    status: string;

    @Column({
        name: 'time',
        type: 'float',
        nullable: true,
    })
    time: number;

    @Column({
        name: 'memory',
        type: 'float',
        nullable: true,
    })
    memory: number;

    @Column({
        name: 'points',
        type: 'float',
        nullable: true,
    })
    points: number;

    @Column({
        name: 'total',
        type: 'float',
        nullable: true,
    })
    total: number;

    @Column({
        name: 'batch',
        nullable: true,
    })
    batch: number;

    @Column({
        name: 'feedback',
    })
    feedback: string;

    @Column({
        name: 'extended_feedback',
        type: 'text',
    })
    extended_feedback: string;

    @Column({
        name: 'output',
        type: 'text',
    })
    output: string;
}
