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

  @CreateDateColumn()
  joinedAt: Date;
}
