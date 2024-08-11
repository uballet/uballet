import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, ManyToOne } from "typeorm"
import { User } from "./User";

@Entity()
export class EmailVerificationCode extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne(() => User, user => user)
    user: User

    @Column()
    userId: string;

    @Column()
    code: string

    @Column({ type: 'timestamp', precision: 3})
    expiresAt: Date

    @Column()
    type: string
}
