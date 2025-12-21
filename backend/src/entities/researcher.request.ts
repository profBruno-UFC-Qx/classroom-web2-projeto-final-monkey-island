import {
  Entity,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";
import { User } from "./User";

export enum ResearcherRequestStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

@Entity()
export class ResearcherRequest {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.researcherRequests, {
    eager: true,
    onDelete: "CASCADE",
  })
  user: User;

  @Column({ type: "text" })
  motivation: string;

  @Column({
    type: "simple-enum",
    enum: ResearcherRequestStatus,
    default: ResearcherRequestStatus.PENDING,
  })
  status: ResearcherRequestStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
