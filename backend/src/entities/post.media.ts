import {
  Entity,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";

import { Post } from "./post";

export enum PostMediaType {
  IMAGE = "IMAGE",
}

@Entity()
export class PostMedia {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Post, (post) => post.medias, {
    onDelete: "CASCADE",
  })
  post: Post;

  @Column({
    type: "simple-enum",
    enum: PostMediaType,
  })
  type: PostMediaType;

  @Column({ type: "varchar", length: 150 })
  url: string;

  @Column({ type: "int", nullable: true })
  order?: number;
}
