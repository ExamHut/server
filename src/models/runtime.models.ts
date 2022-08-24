import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, OneToOne, JoinColumn, JoinTable, CreateDateColumn, ManyToMany, Relation } from "typeorm";
import { IsIP } from "class-validator";

import { Problem } from "@vulcan/models";

@Entity()
export class Language extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 10,
        unique: true,
    })
    code: string;

    @Column({
        length: 20,
        unique: true,
    })
    name: string;

    @Column()
    shortName: string;

    @Column()
    commonName: string;

    @Column({
        length: 10,
    })
    extension: string;

    @Column({
        default: false,
    })
    fileOnly: boolean;

    @Column({
        default: 0,
    })
    fileSizeLimit: number;

    @Column({
        default: false,
    })
    includeInProblem: boolean;
}

@Entity()
export class Judge extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 64,
        unique: true,
    })
    name: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({
        default: false,
    })
    isBlocked: boolean;

    @Column({
        length: 100,
    })
    auth_key: string;

    @Column({
        default: false,
    })
    online: boolean;

    @Column({
        type: 'datetime',
        nullable: true,
    })
    startTime: Date;

    @Column({
        type: 'float',
        precision: 3,
        nullable: true,
    })
    ping: number;

    @Column({
        type: 'float',
        precision: 3,
        nullable: true,
    })
    load: number;

    @Column({
        length: 40,
        nullable: true,
    })
    @IsIP()
    lastIP: string;

    @ManyToMany('Problem')
    @JoinTable()
    problems: Problem[];

    @ManyToMany('Language')
    @JoinTable()
    runtimes: Language[];
}

@Entity()
export class RuntimeVersion extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne('Language')
    @JoinColumn()
    language: Language[];

    @OneToOne('Judge')
    @JoinColumn()
    judge: Judge[];

    @Column({
        length: 64,
    })
    name: string;

    @Column({
        length: 64,
    })
    version: string;

    @Column({
        default: 0,
    })
    priority: number;
}
