import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1766318259341 implements MigrationInterface {
    name = 'AutoMigration1766318259341'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_researcher_request" ("id" varchar PRIMARY KEY NOT NULL, "motivation" text NOT NULL, "status" varchar CHECK( "status" IN ('pending','approved','rejected') ) NOT NULL DEFAULT ('pending'), "userId" varchar, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_0bdfa03f743c6d6f4f3c450d90c" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_researcher_request"("id", "motivation", "status", "userId") SELECT "id", "motivation", "status", "userId" FROM "researcher_request"`);
        await queryRunner.query(`DROP TABLE "researcher_request"`);
        await queryRunner.query(`ALTER TABLE "temporary_researcher_request" RENAME TO "researcher_request"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "researcher_request" RENAME TO "temporary_researcher_request"`);
        await queryRunner.query(`CREATE TABLE "researcher_request" ("id" varchar PRIMARY KEY NOT NULL, "motivation" text NOT NULL, "status" varchar CHECK( "status" IN ('pending','approved','rejected') ) NOT NULL DEFAULT ('pending'), "userId" varchar, CONSTRAINT "FK_0bdfa03f743c6d6f4f3c450d90c" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "researcher_request"("id", "motivation", "status", "userId") SELECT "id", "motivation", "status", "userId" FROM "temporary_researcher_request"`);
        await queryRunner.query(`DROP TABLE "temporary_researcher_request"`);
    }

}
