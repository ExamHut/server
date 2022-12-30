import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, ManyToMany, ManyToOne, JoinTable, CreateDateColumn, Relation, OneToMany, Unique } from "typeorm";

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
@Unique(['problem', 'contest'])
export class ContestProblem extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    points: number;

    @ManyToOne('Problem')
    problem: Relation<Problem>;

    @ManyToOne('Contest')
    contest: Relation<Contest>;

    @OneToMany('Submission', (submission: Relation<Submission>) => submission.problem, { onDelete: 'CASCADE' })
    submissions: Relation<Submission>[];
}
