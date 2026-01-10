import { z } from "zod";

export const researcherRequestSchema = z.object({
  motivation: z
    .string()
    .min(100, "the motivation must have at least 100 characters")
    .max(1000, "The motivation can have a maximum of 1000 characters"),
});
