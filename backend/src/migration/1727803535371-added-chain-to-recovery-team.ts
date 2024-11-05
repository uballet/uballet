import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedChainToRecoveryTeam1727803535371 implements MigrationInterface {
    name = 'AddedChainToRecoveryTeam1727803535371'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recovery_team" ADD "chain" character varying NOT NULL DEFAULT 'sepolia'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recovery_team" DROP COLUMN "chain"`);
    }

}
