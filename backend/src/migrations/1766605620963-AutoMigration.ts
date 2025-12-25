import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1766605620963 implements MigrationInterface {
    name = 'AutoMigration1766605620963'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "artifact" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar(150) NOT NULL, "description" text NOT NULL, "rarity" varchar CHECK( "rarity" IN ('fragment','partial_fossil','rare','exceptional_specimen','unique_specimen') ) NOT NULL DEFAULT ('fragment'), "image" varchar(150) NOT NULL, CONSTRAINT "UQ_b5567c51d2b49291baba57cd976" UNIQUE ("name"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "artifact"`);
    }

}
