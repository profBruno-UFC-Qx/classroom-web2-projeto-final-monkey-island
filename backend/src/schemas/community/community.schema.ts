import { z } from "zod";

export const communitySchema = z.object({
  name: z.string().min(5, "name must have at least 5 characters"),
  description: z
    .string()
    .max(500, "description can have at most 500 characters")
    .optional(),
});
