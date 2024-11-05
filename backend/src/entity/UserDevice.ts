import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from "typeorm"
import { Address } from "../types"
import { User } from "./User"

@Entity()
export class UserDevice extends BaseEntity {
    @(PrimaryGeneratedColumn('uuid'))
    id: string

    @ManyToOne(() => User)
    user: User

    @Column('uuid')
    userId: string

    @Column('varchar')
    token: string
}
