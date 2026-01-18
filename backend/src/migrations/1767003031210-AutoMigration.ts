import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1767003031210 implements MigrationInterface {
    name = 'AutoMigration1767003031210'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "artifact_collection" ("id" varchar PRIMARY KEY NOT NULL, "quantity" integer NOT NULL DEFAULT (1), "userId" varchar, "artifactId" varchar)`);
        await queryRunner.query(`CREATE TABLE "temporary_artifact_collection" ("id" varchar PRIMARY KEY NOT NULL, "quantity" integer NOT NULL DEFAULT (1), "userId" varchar, "artifactId" varchar, CONSTRAINT "FK_bd3060d30aa0ed240ab00a6c568" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_d2cbcbc3813525d759eabe19ed0" FOREIGN KEY ("artifactId") REFERENCES "artifact" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_artifact_collection"("id", "quantity", "userId", "artifactId") SELECT "id", "quantity", "userId", "artifactId" FROM "artifact_collection"`);
        await queryRunner.query(`DROP TABLE "artifact_collection"`);
        await queryRunner.query(`ALTER TABLE "temporary_artifact_collection" RENAME TO "artifact_collection"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "artifact_collection" RENAME TO "temporary_artifact_collection"`);
        await queryRunner.query(`CREATE TABLE "artifact_collection" ("id" varchar PRIMARY KEY NOT NULL, "quantity" integer NOT NULL DEFAULT (1), "userId" varchar, "artifactId" varchar)`);
        await queryRunner.query(`INSERT INTO "artifact_collection"("id", "quantity", "userId", "artifactId") SELECT "id", "quantity", "userId", "artifactId" FROM "temporary_artifact_collection"`);
        await queryRunner.query(`DROP TABLE "temporary_artifact_collection"`);
        await queryRunner.query(`DROP TABLE "artifact_collection"`);
    }

}
