import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm"
import { Address } from "../types"

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    email: string

    @Column({ type: 'boolean', default: false })
    verified: boolean

    @Column({ nullable: true })
    walletAddress: Address
}
