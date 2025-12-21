import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { ResearcherRequest } from "./researcher.request";

import { RegisterRequestDto } from "../dtos/auth/request/register.request.dto";

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  RESEARCHER = "researcher",
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  BANNED = "banned",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "varchar",
    length: 150,
  })
  name: string;

  @Column({
    type: "varchar",
    length: 150,
    unique: true,
  })
  email: string;

  @Column({
    type: "varchar",
    length: 300,
  })
  password: string;

  @Column({
    type: "simple-enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ type: "datetime", nullable: true })
  lastLoginAt: Date;

  @Column({ type: "varchar", nullable: true })
  institution: string;

  @Column({ type: "text", nullable: true, length: 500 })
  bio: string;

  @Column({
    type: "simple-enum",
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @OneToMany(() => ResearcherRequest, (request) => request.user)
  researcherRequests: ResearcherRequest[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
