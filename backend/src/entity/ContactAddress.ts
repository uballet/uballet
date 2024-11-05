import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, ManyToOne } from "typeorm"
import { User } from "./User";

@Entity()
export class ContactAddress extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne(() => User, user => user)
    owner: User

    @Column()
    ownerId: string;

    @Column()
    name: string

    @Column()
    address: string
}
