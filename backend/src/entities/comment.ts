import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { Post } from "./post";

@Entity("comments")
export class Comment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text" })
  content: string;

  @Column({ type: "varchar" })
  userId: string;

  @Column({ type: "varchar" })
  postId: string;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => Post, (post) => post.comments, { onDelete: "CASCADE" })
  @JoinColumn({ name: "postId" })
  post: Post;

  @ManyToOne(() => Comment, (comment) => comment.replies, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "parentId" })
  parent: Comment;

  @Column({ type: "varchar", nullable: true })
  parentId: string | null;

  @OneToMany(() => Comment, (comment) => comment.parent)
  replies: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}