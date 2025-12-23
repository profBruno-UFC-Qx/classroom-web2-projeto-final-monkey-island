import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export enum ArtifactRarity {
  FRAGMENT = "fragment",
  PARTIAL_FOSSIL = "partial_fossil",
  RARE_FOSSIL = "rare",
  EXCEPTIONAL_SPECIMEN = "exceptional_specimen",
  UNIQUE_SPECIMEN = "unique_specimen",
}

@Entity()
export class Artifact {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "varchar",
    length: 150,
  })
  name: string;

  @Column({
    type: "simple-enum",
    enum: ArtifactRarity,
    default: ArtifactRarity.FRAGMENT,
  })
  rarity: ArtifactRarity;

  @Column({
    type: "varchar",
    length: 150,
  })
  image: string;
}
