import { MigrationInterface, QueryRunner } from "typeorm";

export class NotificationTable1726865881200 implements MigrationInterface {
    name = 'NotificationTable1726865881200'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "seen" boolean NOT NULL, "type" character varying NOT NULL, "title" character varying NOT NULL, "body" character varying NOT NULL, "data" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "notification"`);
    }

}
