import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWalletAddressToUser1724187171906 implements MigrationInterface {
    name = 'AddWalletAddressToUser1724187171906'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "walletAddress" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "walletAddress"`);
    }

}
