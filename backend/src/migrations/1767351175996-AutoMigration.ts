import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1767351175996 implements MigrationInterface {
    name = 'AutoMigration1767351175996'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "community" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar(150) NOT NULL, "description" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "createdById" varchar, CONSTRAINT "UQ_696fdadbf0a710efbbf9d98ad9f" UNIQUE ("name"))`);
        await queryRunner.query(`CREATE TABLE "community_user" ("id" varchar PRIMARY KEY NOT NULL, "status" varchar CHECK( "status" IN ('ACTIVE','INACTIVE','BANNED','SUSPENDED') ) NOT NULL DEFAULT ('ACTIVE'), "joinedAt" datetime NOT NULL DEFAULT (datetime('now')), "leftAt" datetime, "suspendedAt" datetime, "suspensionEndsAt" datetime, "bannedAt" datetime, "banReason" text, "userId" varchar, "communityId" varchar, CONSTRAINT "UQ_bd372ac34825213b0ccb110c859" UNIQUE ("userId", "communityId"))`);
        await queryRunner.query(`CREATE TABLE "temporary_community" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar(150) NOT NULL, "description" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "createdById" varchar, CONSTRAINT "UQ_696fdadbf0a710efbbf9d98ad9f" UNIQUE ("name"), CONSTRAINT "FK_dad88c4df9298eff11c903f3b43" FOREIGN KEY ("createdById") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_community"("id", "name", "description", "createdAt", "createdById") SELECT "id", "name", "description", "createdAt", "createdById" FROM "community"`);
        await queryRunner.query(`DROP TABLE "community"`);
        await queryRunner.query(`ALTER TABLE "temporary_community" RENAME TO "community"`);
        await queryRunner.query(`CREATE TABLE "temporary_community_user" ("id" varchar PRIMARY KEY NOT NULL, "status" varchar CHECK( "status" IN ('ACTIVE','INACTIVE','BANNED','SUSPENDED') ) NOT NULL DEFAULT ('ACTIVE'), "joinedAt" datetime NOT NULL DEFAULT (datetime('now')), "leftAt" datetime, "suspendedAt" datetime, "suspensionEndsAt" datetime, "bannedAt" datetime, "banReason" text, "userId" varchar, "communityId" varchar, CONSTRAINT "UQ_bd372ac34825213b0ccb110c859" UNIQUE ("userId", "communityId"), CONSTRAINT "FK_7ebd3469ae3f0c64129af3cc6a5" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_fab8516524e4728bb788da6a924" FOREIGN KEY ("communityId") REFERENCES "community" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_community_user"("id", "status", "joinedAt", "leftAt", "suspendedAt", "suspensionEndsAt", "bannedAt", "banReason", "userId", "communityId") SELECT "id", "status", "joinedAt", "leftAt", "suspendedAt", "suspensionEndsAt", "bannedAt", "banReason", "userId", "communityId" FROM "community_user"`);
        await queryRunner.query(`DROP TABLE "community_user"`);
        await queryRunner.query(`ALTER TABLE "temporary_community_user" RENAME TO "community_user"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "community_user" RENAME TO "temporary_community_user"`);
        await queryRunner.query(`CREATE TABLE "community_user" ("id" varchar PRIMARY KEY NOT NULL, "status" varchar CHECK( "status" IN ('ACTIVE','INACTIVE','BANNED','SUSPENDED') ) NOT NULL DEFAULT ('ACTIVE'), "joinedAt" datetime NOT NULL DEFAULT (datetime('now')), "leftAt" datetime, "suspendedAt" datetime, "suspensionEndsAt" datetime, "bannedAt" datetime, "banReason" text, "userId" varchar, "communityId" varchar, CONSTRAINT "UQ_bd372ac34825213b0ccb110c859" UNIQUE ("userId", "communityId"))`);
        await queryRunner.query(`INSERT INTO "community_user"("id", "status", "joinedAt", "leftAt", "suspendedAt", "suspensionEndsAt", "bannedAt", "banReason", "userId", "communityId") SELECT "id", "status", "joinedAt", "leftAt", "suspendedAt", "suspensionEndsAt", "bannedAt", "banReason", "userId", "communityId" FROM "temporary_community_user"`);
        await queryRunner.query(`DROP TABLE "temporary_community_user"`);
        await queryRunner.query(`ALTER TABLE "community" RENAME TO "temporary_community"`);
        await queryRunner.query(`CREATE TABLE "community" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar(150) NOT NULL, "description" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "createdById" varchar, CONSTRAINT "UQ_696fdadbf0a710efbbf9d98ad9f" UNIQUE ("name"))`);
        await queryRunner.query(`INSERT INTO "community"("id", "name", "description", "createdAt", "createdById") SELECT "id", "name", "description", "createdAt", "createdById" FROM "temporary_community"`);
        await queryRunner.query(`DROP TABLE "temporary_community"`);
        await queryRunner.query(`DROP TABLE "community_user"`);
        await queryRunner.query(`DROP TABLE "community"`);
    }

}
