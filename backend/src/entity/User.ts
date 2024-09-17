import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, AfterInsert, AfterUpdate } from "typeorm"
import { Address } from "../types"
import { addAddressToWebhook } from "../webhooks"

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

    @AfterInsert()
    @AfterUpdate()
    async updateWalletAddress() {
        if (this.walletAddress) {
            await addAddressToWebhook({ address: this.walletAddress })
        }
    }
}
