import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, AfterInsert, AfterUpdate } from "typeorm"
import { Address } from "../types"
import { addAddressToWebhook } from "../webhooks"

@Entity()
export class Notification extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    userId: string

    @Column()
    seen: boolean

    @Column()
    type: string;

    @Column()
    title: string;

    @Column()
    body: string;

    @Column()
    data: string;

    @Column('timestamp')
    createdAt: Date
}
