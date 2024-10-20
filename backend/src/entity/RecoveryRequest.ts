import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from "typeorm"
import { RecoveryTeam } from "./RecoveryTeam"
import { Address, Hex } from "../types"

@Entity()
export class RecoveryRequest extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne(() => RecoveryTeam, { eager: true })
    recoveryTeam: RecoveryTeam

    @Column('uuid')
    recoveryTeamId: string

    @Column()
    newAddress1: Address

    @Column()
    newAddress2: Address

    @Column('varchar',{ nullable: true })
    callData?: Hex

    @Column('varchar', { nullable: true })
    aggregatedSignature?: Hex

    @Column('varchar', { nullable: true })
    signature1?: Hex

    @Column('varchar', { nullable: true })
    signature2?: Hex

    @Column({ default: 'pending' })
    status: string
}
