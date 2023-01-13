import { Entity, Column, BaseEntity, ManyToOne, PrimaryGeneratedColumn, OneToOne, OneToMany, Relation, Unique, BeforeInsert, BeforeUpdate, CreateDateColumn, JoinColumn, RelationId } from "typeorm";

import { User, Class, Submission, ContestProblem } from "@vulcan/models";

@Entity()
export class Contest extends BaseEntity {
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
        length: 256,
    })
    name: string;

    @Column({
        name: 'description',
        type: "text",
    })
    description: string;

    @Column({
        name: 'start_date',
        type: "datetime",
    })
    startDate: Date;

    @Column()
    duration: number;  // In minutes. If < 0 then it will be set to the difference between startDate and endDate.

    @Column({
        name: 'end_date',
        type: "datetime",
    })
    endDate: Date;

    @ManyToOne('User')
    @JoinColumn({
        name: 'author_id',
    })
    author: Promise<Relation<User>>;

    @RelationId((contest: Contest) => contest.author)
    @Column({ name: 'author_id' })
    authorId: number;

    @ManyToOne('Class')
    @JoinColumn({
        name: 'class_id',
    })
    class: Promise<Relation<Class>>;

    @RelationId((contest: Contest) => contest.class)
    @Column({ name: 'class_id' })
    classId: number;

    @OneToMany('ContestProblem', (contestProblem: Relation<ContestProblem>) => contestProblem.contest, { onDelete: 'CASCADE' })
    problems: Promise<Relation<ContestProblem>[]>;

    @BeforeInsert()
    @BeforeUpdate()
    validateDuration() {
        if (this.duration <= 0) {
            this.duration = Math.floor((this.endDate.getTime() - this.startDate.getTime()) / 60);
        }
    }

    @BeforeInsert()
    @BeforeUpdate()
    validateEndDate() {
        if (this.endDate.getTime() < this.startDate.getTime()) {
            throw new Error('End date cannot be before start date.');
        }
    }

    timeLeft(): number {
        return Math.abs(this.endDate.getTime() - new Date().getTime());
    }
}

@Entity()
export class ContestParticipation extends BaseEntity {
    @PrimaryGeneratedColumn({
        name: 'id',
    })
    id: number;

    @Column({
        name: 'points',
        type: 'float',
        default: 0,
    })
    points: number;

    @Column({
        name: 'virtual',
        default: 0,
    })
    virtual: number;
    static PARTICIPATION_LIVE = 0;
    static PARTICIPATION_VIRTUAL = 1;

    @Column({
        name: 'part_count',
    })
    part_count: number;

    @Column({
        name: 'disqualified',
        default: false,
    })
    disqualified: boolean;

    @Column({
        name: 'participation_date',
        type: 'datetime',
        default: () => 'NOW()',
    })
    participationDate: Date;

    @Column({
        name: 'end_date',
        type: 'datetime',
        default: () => 'NOW()',
    })
    endDate: Date;  // This will be set to the end of the contest based on the duration.

    @ManyToOne('User', { cascade: true })
    @JoinColumn({
        name: 'user_id',
    })
    user: Promise<Relation<User>>;

    @RelationId((contestParticipation: ContestParticipation) => contestParticipation.user)
    @Column({ name: 'user_id' })
    userId: number;

    @ManyToOne('Contest', { cascade: true })
    @JoinColumn({
        name: 'contest_id',
    })
    contest: Promise<Relation<Contest>>;

    @RelationId((contestParticipation: ContestParticipation) => contestParticipation.contest)
    @Column({ name: 'contest_id' })
    contestId: number;

    @BeforeInsert()
    @BeforeUpdate()
    async autoSetDuration() {
        if (this.virtual === ContestParticipation.PARTICIPATION_VIRTUAL) {
            this.endDate = new Date(this.participationDate.getTime() + (await this.contest).duration * 60000);
        } else {
            this.endDate = (await this.contest).endDate;
        }
    }

    @BeforeInsert()
    @BeforeUpdate()
    async autoSetPartCount() {
        this.part_count = (await ContestParticipation.find({ where: { user: { id: (await this.user).id }, contest: { id: (await this.contest).id } } })).length + 1;
    }
}
