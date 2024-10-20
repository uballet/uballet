import { MigrationInterface, QueryRunner } from "typeorm";

export class AddressToLowercase1726604918809 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE "user" SET "walletAddress" = LOWER("walletAddress")`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
