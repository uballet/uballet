import { Entity, Column, BaseEntity, PrimaryColumn } from "typeorm"

@Entity()
export class PasskeyChallenge extends BaseEntity {
    @PrimaryColumn()
    id: string

    @Column({ nullable: true })
    appUserId?: string

    @Column({ nullable: true })
    webAuthnUserId?: string

    @Column()
    type: string

    @Column({ type: 'timestamp' })
    expiresAt: Date
}
