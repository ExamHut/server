import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, BeforeInsert, BeforeUpdate, ManyToMany, JoinTable } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn({
        name: 'id',
    })
    id: number;

    @Column({
        name: 'username',
        length: 64,
        unique: true,
    })
    username: string;

    @Column({
        name: 'name',
        length: 128,
    })
    name: string;

    @Column({
        name: 'password',
        length: 256,
    })
    password: string;
    static PASSWORD_ACTUAL_LENGTH = 64;

    @Column({
        name: 'email',
        length: 128,
        unique: true,
    })
    email: string;

    @Column({
        name: 'refresh_token',
        length: 128,
        nullable: true,
    })
    refreshToken: string;

    @ManyToMany('Class')
    @JoinTable({
        name: 'user_class',
        joinColumn: {
            name: 'user_id',
        },
        inverseJoinColumn: {
            name: 'class_id',
        },
    })
    classes: Class[];

    @BeforeInsert()
    @BeforeUpdate()
    validatePassword() {
        if (this.password.length < 8 || this.password.length > User.PASSWORD_ACTUAL_LENGTH) {
            throw new TypeError("Password must be between 8 and " + User.PASSWORD_ACTUAL_LENGTH + " characters.");
        }
        this.password = User.hashPassword(this.password);
    }

    static hashPassword(password: string) {
        return bcrypt.hashSync(password, 10);
    }

    verifyPassword(password: string) {
        return bcrypt.compareSync(password, this.password);
    }
}

@Entity()
export class Class extends BaseEntity {
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
}
