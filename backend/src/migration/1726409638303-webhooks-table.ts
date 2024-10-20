import { MigrationInterface, QueryRunner } from "typeorm";

export class WebhooksTable1726409638303 implements MigrationInterface {
    name = 'WebhooksTable1726409638303'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "web_hook" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "externalId" character varying NOT NULL, "name" character varying NOT NULL, "type" character varying NOT NULL, "token" character varying NOT NULL, "network" character varying NOT NULL, "url" character varying NOT NULL, CONSTRAINT "PK_4b6eea3e15693b62b6fa173606b" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "web_hook"`);
    }

}
