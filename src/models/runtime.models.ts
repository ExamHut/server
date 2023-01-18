import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, OneToOne, JoinColumn, JoinTable, CreateDateColumn, ManyToMany, Relation, RelationId } from "typeorm";
import { IsIP } from "class-validator";

import { LanguageName } from "@uiw/codemirror-extensions-langs";
import { Problem } from "@vulcan/models";

@Entity()
export class Language extends BaseEntity {
    @PrimaryGeneratedColumn({
        name: 'id',
    })
    id: number;

    @Column({
        name: 'code',
        length: 10,
        unique: true,
    })
    code: string;

    @Column({
        name: 'name',
        length: 20,
        unique: true,
    })
    name: string;

    @Column({
        name: 'short_name',
    })
    shortName: string;

    @Column({
        name: 'common_name',
    })
    commonName: string;

    @Column({
        name: 'extension',
        length: 10,
    })
    extension: string;

    @Column({
        name: 'file_only',
        default: false,
    })
    fileOnly: boolean;

    @Column({
        name: 'file_size_limit',
        default: 0,
    })
    fileSizeLimit: number;

    @Column({
        name: 'include_in_problem',
        default: false,
    })
    includeInProblem: boolean;
}

@Entity()
export class Judge extends BaseEntity {
    @PrimaryGeneratedColumn({
        name: 'id',
    })
    id: number;

    @Column({
        name: 'name',
        length: 64,
        unique: true,
    })
    name: string;

    @Column({
        name: 'created_at',
        type: 'datetime',
        default: () => 'NOW()',
    })
    createdAt: Date;

    @Column({
        name: 'is_blocked',
        default: false,
    })
    isBlocked: boolean;

    @Column({
        name: 'auth_key',
        length: 100,
    })
    auth_key: string;

    @Column({
        name: 'online',
        default: false,
    })
    online: boolean;

    @Column({
        name: 'start_time',
        type: 'datetime',
        nullable: true,
    })
    startTime: Date;

    @Column({
        name: 'ping',
        type: 'float',
        precision: 3,
        nullable: true,
    })
    ping: number;

    @Column({
        name: 'load',
        type: 'float',
        precision: 3,
        nullable: true,
    })
    load: number;

    @Column({
        name: 'last_ip',
        length: 40,
        nullable: true,
    })
    @IsIP()
    lastIP: string;

    @ManyToMany('Problem')
    @JoinTable({
        name: 'judge_problem',
        joinColumn: {
            name: 'judge_id',
        },
        inverseJoinColumn: {
            name: 'problem_id',
        },
    })
    problems: Problem[];

    @ManyToMany('Language')
    @JoinTable({
        name: 'judge_language',
        joinColumn: {
            name: 'judge_id',
        },
        inverseJoinColumn: {
            name: 'language_id',
        },
    })
    runtimes: Language[];
}

@Entity()
export class RuntimeVersion extends BaseEntity {
    @PrimaryGeneratedColumn({
        name: 'id',
    })
    id: number;

    @OneToOne('Language')
    @JoinColumn({
        name: 'language_id',
    })
    language: Language;

    @RelationId((runtimeVersion: RuntimeVersion) => runtimeVersion.language)
    @Column({ name: 'language_id' })
    languageId: number;

    @OneToOne('Judge')
    @JoinColumn({
        name: 'judge_id',
    })
    judge: Judge;

    @RelationId((runtimeVersion: RuntimeVersion) => runtimeVersion.judge)
    @Column({ name: 'judge_id' })
    judgeId: number;

    @Column({
        name: 'name',
        length: 64,
    })
    name: string;

    @Column({
        name: 'version',
        length: 64,
    })
    version: string;

    @Column({
        name: 'priority',
        default: 0,
    })
    priority: number;
}
