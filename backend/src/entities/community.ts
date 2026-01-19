import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";
import { CommunityUser } from "./community.user";

@Entity()
export class Community {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, {
    onDelete: "CASCADE",
  })
  createdBy: User;

  @Column({
    type: "varchar",
    length: 150,
    unique: true,
  })
  name: string;

  @Column({ type: "text" })
  description: string;

  @OneToMany(() => CommunityUser, (cu) => cu.community)
  members: CommunityUser[];

  @CreateDateColumn()
  createdAt: Date;
}
