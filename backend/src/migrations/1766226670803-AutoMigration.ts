import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1766226670803 implements MigrationInterface {
    name = 'AutoMigration1766226670803'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar(150) NOT NULL, "email" varchar(150) NOT NULL, "password" varchar(300) NOT NULL, "role" varchar CHECK( "role" IN ('admin','user','researcher') ) NOT NULL DEFAULT ('user'), "lastLoginAt" datetime, "institution" varchar, "bio" varchar(500), "status" varchar CHECK( "status" IN ('active','inactive','banned') ) NOT NULL DEFAULT ('active'), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
