import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, BeforeInsert, BeforeUpdate, ManyToMany, JoinTable } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 64,
        unique: true,
    })
    username: string;

    @Column({
        length: 128,
    })
    name: string;

    @Column({
        length: 256,
    })
    password: string;
    static PASSWORD_ACTUAL_LENGTH = 64;

    @Column({
        length: 128,
        unique: true,
    })
    email: string;

    @Column({
        length: 128,
        nullable: true,
    })
    refreshToken: string;

    @ManyToMany('Class')
    @JoinTable()
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
}
