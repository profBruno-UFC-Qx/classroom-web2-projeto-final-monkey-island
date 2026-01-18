import {
  Entity,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";

import { User } from "./User";
import { Community } from "./community";
import { PostMedia } from "./post.media";
import { Like } from "./like";
import { Comment } from "./comment";

export enum PostStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  DELETED = "DELETED",
}

@Entity()
export class Post {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  title: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  author: User;

  @ManyToOne(() => Community, { onDelete: "CASCADE" })
  community: Community;

  @OneToMany(() => PostMedia, (media) => media.post, {
    cascade: true,
  })
  medias: PostMedia[];

  @Column({
    type: "simple-enum",
    enum: PostStatus,
    default: PostStatus.DRAFT,
  })
  status: PostStatus;

  @Column({ type: "text" })
  content: string;

  @Column({ type: "int", default: 0 })
  likeCount: number;

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
  
  @Column({ type: "int", default: 0 })
  commentCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}
