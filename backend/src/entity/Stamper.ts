import { Entity, Column, BaseEntity, PrimaryColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { User } from "./User"

@Entity()
export class Stamper extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: string

    @ManyToOne(() => User)
    user: User
    
    @Column()
    userId: string

    @Column({ type: 'varchar' })
    value: string

    @Column({ type: 'timestamp' })
    expiresAt: Date
}
