import { z } from "zod";

export const suspendSchema = z.object({
  suspensionEndsAt: z
    .string()
    .datetime({ message: "suspensionEndsAt must be a valid ISO datetime" })
    .transform((value) => new Date(value))
    .refine(
      (date) => date.getTime() > Date.now(),
      "suspensionEndsAt must be a future date"
    ),
});
