import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(5, "title must have at least 5 characters"),
  content: z
    .string()
    .max(5000, "content can have at most 5000 characters")
    .optional(),
});
