import { MigrationInterface, QueryRunner } from "typeorm";

export class RecoveryTables1726083256652 implements MigrationInterface {
    name = 'RecoveryTables1726083256652'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "recovery_team" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "recoverer1Id" uuid NOT NULL, "recoverer1Address" character varying NOT NULL DEFAULT false, "recoverer2Id" uuid NOT NULL, "recoverer2Address" character varying NOT NULL DEFAULT false, "userConfirmed" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_d7e4b5dfbbd03bd41fad94e48cd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "recovery_request" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "recoveryTeamId" uuid NOT NULL, "newAddress1" character varying NOT NULL, "newAddress2" character varying NOT NULL, "callData" character varying, "aggregatedSignature" character varying, "signature1" character varying, "signature2" character varying, "status" character varying NOT NULL DEFAULT 'pending', CONSTRAINT "PK_63474ac3ff8d4033dbd40b2b5d1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "recovery_team" ADD CONSTRAINT "FK_6f59aa37b6f064a16de8943e663" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recovery_team" ADD CONSTRAINT "FK_84ecd09fc37818092f6840009f0" FOREIGN KEY ("recoverer1Id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recovery_team" ADD CONSTRAINT "FK_368474dbeb893600bffb4481bee" FOREIGN KEY ("recoverer2Id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recovery_request" ADD CONSTRAINT "FK_178dbdcbc630989e31d206e14dd" FOREIGN KEY ("recoveryTeamId") REFERENCES "recovery_team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recovery_request" DROP CONSTRAINT "FK_178dbdcbc630989e31d206e14dd"`);
        await queryRunner.query(`ALTER TABLE "recovery_team" DROP CONSTRAINT "FK_368474dbeb893600bffb4481bee"`);
        await queryRunner.query(`ALTER TABLE "recovery_team" DROP CONSTRAINT "FK_84ecd09fc37818092f6840009f0"`);
        await queryRunner.query(`ALTER TABLE "recovery_team" DROP CONSTRAINT "FK_6f59aa37b6f064a16de8943e663"`);
        await queryRunner.query(`DROP TABLE "recovery_request"`);
        await queryRunner.query(`DROP TABLE "recovery_team"`);
    }

}
