import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserWalletType1726594722068 implements MigrationInterface {
    name = 'AddUserWalletType1726594722068'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "walletType" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "walletType"`);
    }

}
