import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1766317909007 implements MigrationInterface {
    name = 'AutoMigration1766317909007'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_user" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar(150) NOT NULL, "email" varchar(150) NOT NULL, "password" varchar(300) NOT NULL, "role" varchar CHECK( "role" IN ('admin','user','researcher') ) NOT NULL DEFAULT ('user'), "lastLoginAt" datetime, "institution" varchar, "bio" varchar(500), "status" varchar CHECK( "status" IN ('active','inactive','banned') ) NOT NULL DEFAULT ('active'), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "temporary_user"("id", "name", "email", "password", "role", "lastLoginAt", "institution", "bio", "status", "createdAt", "updatedAt") SELECT "id", "name", "email", "password", "role", "lastLoginAt", "institution", "bio", "status", "createdAt", "updatedAt" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
        await queryRunner.query(`CREATE TABLE "researcher_request" ("id" varchar PRIMARY KEY NOT NULL, "motivation" text NOT NULL, "status" varchar CHECK( "status" IN ('pending','approved','rejected') ) NOT NULL DEFAULT ('pending'), "userId" varchar)`);
        await queryRunner.query(`CREATE TABLE "temporary_user" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar(150) NOT NULL, "email" varchar(150) NOT NULL, "password" varchar(300) NOT NULL, "role" varchar CHECK( "role" IN ('admin','user','researcher') ) NOT NULL DEFAULT ('user'), "lastLoginAt" datetime, "institution" varchar, "bio" text(500), "status" varchar CHECK( "status" IN ('active','inactive','banned') ) NOT NULL DEFAULT ('active'), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "temporary_user"("id", "name", "email", "password", "role", "lastLoginAt", "institution", "bio", "status", "createdAt", "updatedAt") SELECT "id", "name", "email", "password", "role", "lastLoginAt", "institution", "bio", "status", "createdAt", "updatedAt" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
        await queryRunner.query(`CREATE TABLE "temporary_researcher_request" ("id" varchar PRIMARY KEY NOT NULL, "motivation" text NOT NULL, "status" varchar CHECK( "status" IN ('pending','approved','rejected') ) NOT NULL DEFAULT ('pending'), "userId" varchar, CONSTRAINT "FK_0bdfa03f743c6d6f4f3c450d90c" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_researcher_request"("id", "motivation", "status", "userId") SELECT "id", "motivation", "status", "userId" FROM "researcher_request"`);
        await queryRunner.query(`DROP TABLE "researcher_request"`);
        await queryRunner.query(`ALTER TABLE "temporary_researcher_request" RENAME TO "researcher_request"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "researcher_request" RENAME TO "temporary_researcher_request"`);
        await queryRunner.query(`CREATE TABLE "researcher_request" ("id" varchar PRIMARY KEY NOT NULL, "motivation" text NOT NULL, "status" varchar CHECK( "status" IN ('pending','approved','rejected') ) NOT NULL DEFAULT ('pending'), "userId" varchar)`);
        await queryRunner.query(`INSERT INTO "researcher_request"("id", "motivation", "status", "userId") SELECT "id", "motivation", "status", "userId" FROM "temporary_researcher_request"`);
        await queryRunner.query(`DROP TABLE "temporary_researcher_request"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar(150) NOT NULL, "email" varchar(150) NOT NULL, "password" varchar(300) NOT NULL, "role" varchar CHECK( "role" IN ('admin','user','researcher') ) NOT NULL DEFAULT ('user'), "lastLoginAt" datetime, "institution" varchar, "bio" varchar(500), "status" varchar CHECK( "status" IN ('active','inactive','banned') ) NOT NULL DEFAULT ('active'), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "user"("id", "name", "email", "password", "role", "lastLoginAt", "institution", "bio", "status", "createdAt", "updatedAt") SELECT "id", "name", "email", "password", "role", "lastLoginAt", "institution", "bio", "status", "createdAt", "updatedAt" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
        await queryRunner.query(`DROP TABLE "researcher_request"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar(150) NOT NULL, "email" varchar(150) NOT NULL, "password" varchar(300) NOT NULL, "role" varchar CHECK( "role" IN ('admin','user','researcher') ) NOT NULL DEFAULT ('user'), "lastLoginAt" datetime, "institution" varchar, "bio" varchar(500), "status" varchar CHECK( "status" IN ('active','inactive','banned') ) NOT NULL DEFAULT ('active'), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "user"("id", "name", "email", "password", "role", "lastLoginAt", "institution", "bio", "status", "createdAt", "updatedAt") SELECT "id", "name", "email", "password", "role", "lastLoginAt", "institution", "bio", "status", "createdAt", "updatedAt" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
    }

}
