import { MigrationInterface, QueryRunner } from "typeorm";

export class WebhooksTableRemoveToken1726410158669 implements MigrationInterface {
    name = 'WebhooksTableRemoveToken1726410158669'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "web_hook" DROP COLUMN "token"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "web_hook" ADD "token" character varying NOT NULL`);
    }

}
