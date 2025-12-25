import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";
import { Artifact } from "./artifact";

@Entity()
export class ArtifactCollection {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.artifactsColletions, {
    onDelete: "CASCADE",
  })
  user: User;

  @ManyToOne(() => Artifact, (artifact) => artifact.artifactsCollection, {
    onDelete: "CASCADE",
  })
  artifact: Artifact;

  @Column({ default: 1 })
  quantity: number;
}
