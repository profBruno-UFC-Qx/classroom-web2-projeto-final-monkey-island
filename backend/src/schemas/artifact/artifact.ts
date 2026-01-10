import { z } from "zod";
import { ArtifactRarity } from "../../entities/artifact";

const rarityValues = Object.values(ArtifactRarity);

export const artifactSchema = z.object({
  name: z.string().min(2, "name must have at least 2 characters"),

  rarity: z.preprocess(
    (val) => (typeof val === "string" ? val.trim().toLowerCase() : val),
    z.string().refine((val) => rarityValues.includes(val as ArtifactRarity), {
      message: `rarity must be one of: ${rarityValues.join(", ")}`,
    })
  ),

  description: z
    .string()
    .max(500, "description can have at most 500 characters")
    .optional(),
});
