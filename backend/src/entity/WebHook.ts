import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from "typeorm"
import { Address } from "../types"
import { User } from "./User"

@Entity()
export class WebHook extends BaseEntity {
    @(PrimaryGeneratedColumn('uuid'))
    id: string;

    @Column('varchar')
    externalId: string;

    @Column('varchar')
    name: string;

    @Column('varchar')
    type: string

    @Column('varchar')
    network: string

    @Column('varchar')
    url: string
}
