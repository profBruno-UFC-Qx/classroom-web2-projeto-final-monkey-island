import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1767970164928 implements MigrationInterface {
    name = 'AutoMigration1767970164928'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "post_media" ("id" varchar PRIMARY KEY NOT NULL, "type" varchar CHECK( "type" IN ('IMAGE') ) NOT NULL DEFAULT ('IMAGE'), "url" varchar(400) NOT NULL, "order" integer NOT NULL, "postId" varchar)`);
        await queryRunner.query(`CREATE TABLE "post" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar(255) NOT NULL, "status" varchar CHECK( "status" IN ('DRAFT','PUBLISHED','DELETED') ) NOT NULL DEFAULT ('DRAFT'), "content" text NOT NULL, "likeCount" integer NOT NULL DEFAULT (0), "commentCount" integer NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "authorId" varchar, "communityId" varchar)`);
        await queryRunner.query(`CREATE TABLE "temporary_post_media" ("id" varchar PRIMARY KEY NOT NULL, "type" varchar CHECK( "type" IN ('IMAGE') ) NOT NULL DEFAULT ('IMAGE'), "url" varchar(400) NOT NULL, "order" integer NOT NULL, "postId" varchar, CONSTRAINT "FK_4adcc5190e3b5c7e9001adef3b8" FOREIGN KEY ("postId") REFERENCES "post" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_post_media"("id", "type", "url", "order", "postId") SELECT "id", "type", "url", "order", "postId" FROM "post_media"`);
        await queryRunner.query(`DROP TABLE "post_media"`);
        await queryRunner.query(`ALTER TABLE "temporary_post_media" RENAME TO "post_media"`);
        await queryRunner.query(`CREATE TABLE "temporary_post" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar(255) NOT NULL, "status" varchar CHECK( "status" IN ('DRAFT','PUBLISHED','DELETED') ) NOT NULL DEFAULT ('DRAFT'), "content" text NOT NULL, "likeCount" integer NOT NULL DEFAULT (0), "commentCount" integer NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "authorId" varchar, "communityId" varchar, CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0" FOREIGN KEY ("authorId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_eff802f635e95c8aef1998b4843" FOREIGN KEY ("communityId") REFERENCES "community" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_post"("id", "title", "status", "content", "likeCount", "commentCount", "createdAt", "updatedAt", "authorId", "communityId") SELECT "id", "title", "status", "content", "likeCount", "commentCount", "createdAt", "updatedAt", "authorId", "communityId" FROM "post"`);
        await queryRunner.query(`DROP TABLE "post"`);
        await queryRunner.query(`ALTER TABLE "temporary_post" RENAME TO "post"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" RENAME TO "temporary_post"`);
        await queryRunner.query(`CREATE TABLE "post" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar(255) NOT NULL, "status" varchar CHECK( "status" IN ('DRAFT','PUBLISHED','DELETED') ) NOT NULL DEFAULT ('DRAFT'), "content" text NOT NULL, "likeCount" integer NOT NULL DEFAULT (0), "commentCount" integer NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "authorId" varchar, "communityId" varchar)`);
        await queryRunner.query(`INSERT INTO "post"("id", "title", "status", "content", "likeCount", "commentCount", "createdAt", "updatedAt", "authorId", "communityId") SELECT "id", "title", "status", "content", "likeCount", "commentCount", "createdAt", "updatedAt", "authorId", "communityId" FROM "temporary_post"`);
        await queryRunner.query(`DROP TABLE "temporary_post"`);
        await queryRunner.query(`ALTER TABLE "post_media" RENAME TO "temporary_post_media"`);
        await queryRunner.query(`CREATE TABLE "post_media" ("id" varchar PRIMARY KEY NOT NULL, "type" varchar CHECK( "type" IN ('IMAGE') ) NOT NULL DEFAULT ('IMAGE'), "url" varchar(400) NOT NULL, "order" integer NOT NULL, "postId" varchar)`);
        await queryRunner.query(`INSERT INTO "post_media"("id", "type", "url", "order", "postId") SELECT "id", "type", "url", "order", "postId" FROM "temporary_post_media"`);
        await queryRunner.query(`DROP TABLE "temporary_post_media"`);
        await queryRunner.query(`DROP TABLE "post"`);
        await queryRunner.query(`DROP TABLE "post_media"`);
    }

}
