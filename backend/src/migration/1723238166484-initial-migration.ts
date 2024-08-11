import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1723238166484 implements MigrationInterface {
    name = 'InitialMigration1723238166484'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "passkey_challenge" ("id" character varying NOT NULL, "appUserId" character varying, "webAuthnUserId" character varying, "type" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_aea61bf645973e49c770a7f4203" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "verified" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "passkey" ("id" character varying NOT NULL, "name" character varying NOT NULL, "appUserId" character varying NOT NULL, "webAuthnUserId" character varying NOT NULL, "publicKey" character varying NOT NULL, "aaguid" character varying NOT NULL, "registeredAt" TIMESTAMP NOT NULL, "deviceType" character varying NOT NULL, "backedUp" boolean NOT NULL, "userVerified" boolean NOT NULL, "transports" character varying array NOT NULL, "userId" uuid, CONSTRAINT "PK_783e2060d8025abd6a6ca45d2c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "stamper" ("id" SERIAL NOT NULL, "userId" uuid NOT NULL, "value" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_3530404c5ef3fc4f84f60c8a78b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contact_address" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ownerId" uuid NOT NULL, "name" character varying NOT NULL, "address" character varying NOT NULL, CONSTRAINT "PK_53003c26af98f76f2d3f4de1f4b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "email_verification_code" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "code" character varying NOT NULL, "expiresAt" TIMESTAMP(3) NOT NULL, "type" character varying NOT NULL, CONSTRAINT "PK_7fc72ac16aeeab466c48748221c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "passkey" ADD CONSTRAINT "FK_c36f303905314ea9ead857b6268" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stamper" ADD CONSTRAINT "FK_a3eed5fe4f687d9eff225b7d344" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contact_address" ADD CONSTRAINT "FK_c7360e44fa52c61700a0b75b774" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "email_verification_code" ADD CONSTRAINT "FK_cace043f9e8bee80c2dd5c66ccc" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_verification_code" DROP CONSTRAINT "FK_cace043f9e8bee80c2dd5c66ccc"`);
        await queryRunner.query(`ALTER TABLE "contact_address" DROP CONSTRAINT "FK_c7360e44fa52c61700a0b75b774"`);
        await queryRunner.query(`ALTER TABLE "stamper" DROP CONSTRAINT "FK_a3eed5fe4f687d9eff225b7d344"`);
        await queryRunner.query(`ALTER TABLE "passkey" DROP CONSTRAINT "FK_c36f303905314ea9ead857b6268"`);
        await queryRunner.query(`DROP TABLE "email_verification_code"`);
        await queryRunner.query(`DROP TABLE "contact_address"`);
        await queryRunner.query(`DROP TABLE "stamper"`);
        await queryRunner.query(`DROP TABLE "passkey"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "passkey_challenge"`);
    }

}
