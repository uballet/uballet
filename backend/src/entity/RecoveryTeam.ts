import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from "typeorm"
import { User } from "./User"
import { Address } from "../types"

@Entity()
export class RecoveryTeam extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne(() => User, { eager: true })
    user: User

    @Column()
    userId: string
    
    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: "recoverer1Id" })
    recoverer1: User

    @Column('uuid')
    recoverer1Id: string

    @Column({ nullable: true })
    recoverer1Address?: Address

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: "recoverer2Id" })
    recoverer2: User

    @Column('uuid')
    recoverer2Id: string

    @Column({ nullable: true })
    recoverer2Address?: Address
    
    @Column({ default: false })
    userConfirmed: boolean

    @Column({ default: 'sepolia' })
    chain: string
}
