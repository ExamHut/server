import { Entity, Column, BaseEntity, ManyToOne, PrimaryGeneratedColumn, OneToOne } from "typeorm";

import { User, Class, Submission, ContestProblem } from "@vulcan/models";

@Entity()
export class Contest extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 64,
        unique: true,
    })
    code: string;

    @Column({
        length: 256,
    })
    name: string;

    @Column({
        type: "text",
    })
    description: string;

    @Column({
        type: "datetime",
    })
    startDate: Date;

    @Column({
        type: "datetime",
    })
    endDate: Date;

    @ManyToOne('User')
    author: User;

    @ManyToOne('Class')
    class: Class;
}

@Entity()
export class ContestParticipation extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    points: number;

    @Column({
        default: 0,
    })
    participateCount: number;

    @Column({
        default: false,
    })
    disqualified: boolean;

    @ManyToOne('User')
    user: User;
}

@Entity()
export class ContestSubmission extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 0, type: "float" })
    points: number;

    @Column({
        default: false,
    })
    is_presented: boolean;

    @ManyToOne('ContestParticipation')
    participation: ContestParticipation;

    @OneToOne('Submission')
    submission: Submission;

    @ManyToOne('ContestProblem')
    problem: ContestProblem;
}
