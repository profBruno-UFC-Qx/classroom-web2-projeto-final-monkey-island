import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  Unique,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Community } from "./community";

export enum CommunityUserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BANNED = "BANNED",
  SUSPENDED = "SUSPENDED",
}

@Entity()
@Unique(["user", "community"])
export class CommunityUser {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, {
    onDelete: "CASCADE",
  })
  user: User;

  @ManyToOne(() => Community, {
    onDelete: "CASCADE",
  })
  community: Community;

  @Column({
    type: "simple-enum",
    enum: CommunityUserStatus,
    default: CommunityUserStatus.ACTIVE,
  })
  status: CommunityUserStatus;

  @CreateDateColumn()
  joinedAt: Date;

  @Column({ type: "datetime", nullable: true })
  leftAt?: Date | null;

  @Column({ type: "datetime", nullable: true })
  suspendedAt?: Date | null;

  @Column({ type: "datetime", nullable: true })
  suspensionEndsAt?: Date | null;

  @Column({ type: "datetime", nullable: true })
  bannedAt?: Date | null;

  @Column({ type: "text", nullable: true })
  banReason?: string | null;
}
