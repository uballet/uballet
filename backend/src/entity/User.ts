import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, AfterInsert, AfterUpdate } from "typeorm"
import { Address } from "../types"
import { addAddressToWebhook } from "../webhooks"
import { IS_E2E_TESTING } from "../env"

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

    @Column({ nullable: true })
    walletType: "light" | "multisig"

    @AfterInsert()
    @AfterUpdate()
    async updateWalletAddress() {
        if (IS_E2E_TESTING) return
        if (this.walletAddress) {
            await addAddressToWebhook({ address: this.walletAddress })
        }
    }
}
