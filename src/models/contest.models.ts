import { Entity, Column, BaseEntity, ManyToOne, PrimaryGeneratedColumn, OneToOne, OneToMany, Relation, Unique, BeforeInsert, BeforeUpdate, CreateDateColumn, JoinColumn } from "typeorm";

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

    @Column()
    duration: number;  // In minutes. If < 0 then it will be set to the difference between startDate and endDate.

    @Column({
        type: "datetime",
    })
    endDate: Date;

    @ManyToOne('User')
    @JoinColumn()
    author: User;

    @ManyToOne('Class')
    @JoinColumn()
    class: Class;

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
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'float',
        default: 0,
    })
    points: number;

    @Column({
        default: 0,
    })
    virtual: number;
    static PARTICIPATION_LIVE = 0;
    static PARTICIPATION_VIRTUAL = 1;

    @Column()
    part_count: number;

    @Column({
        default: false,
    })
    disqualified: boolean;

    @CreateDateColumn()
    participationDate: Date;

    @CreateDateColumn()
    endDate: Date;  // This will be set to the end of the contest based on the duration.

    @ManyToOne('User', { cascade: true })
    @JoinColumn()
    user: Promise<Relation<User>>;

    @ManyToOne('Contest', { cascade: true })
    @JoinColumn()
    contest: Promise<Relation<Contest>>;

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
