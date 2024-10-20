import { MigrationInterface, QueryRunner } from "typeorm";

export class RecoveryTablesUpdate1726084346760 implements MigrationInterface {
    name = 'RecoveryTablesUpdate1726084346760'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recovery_team" ALTER COLUMN "recoverer1Address" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "recovery_team" ALTER COLUMN "recoverer1Address" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "recovery_team" ALTER COLUMN "recoverer2Address" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "recovery_team" ALTER COLUMN "recoverer2Address" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recovery_team" ALTER COLUMN "recoverer2Address" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "recovery_team" ALTER COLUMN "recoverer2Address" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "recovery_team" ALTER COLUMN "recoverer1Address" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "recovery_team" ALTER COLUMN "recoverer1Address" SET NOT NULL`);
    }

}
