import { Entity, Column, BaseEntity, PrimaryColumn, ManyToOne } from "typeorm"
import { User } from "./User";

@Entity()
export class Passkey extends BaseEntity {
    @PrimaryColumn()
    id: string

    @Column()
    name: string
    
    @ManyToOne(() => User)
    user: User
    
    @Column()
    appUserId: string
    
    @Column()
    webAuthnUserId: string

    @Column()
    publicKey: string;

    @Column()
    aaguid: string

    @Column({ type: 'timestamp' })
    registeredAt: Date

    @Column()
    deviceType: string

    @Column({ type: 'boolean' })
    backedUp: boolean
    
    @Column({ type: 'boolean' })
    userVerified: boolean
    
    @Column('varchar', { array: true })
    transports: string[]
}
