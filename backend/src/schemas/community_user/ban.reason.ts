import { z } from "zod";

export const banSchema = z.object({
  banReason: z
    .string()
    .min(5, "banReason must have at least 5 characters")
    .max(255, "banReason can have at most 255 characters"),
});
