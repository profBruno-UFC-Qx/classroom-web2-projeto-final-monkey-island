import { email, z } from "zod";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const loginSchema = z.object({
  email: z.email("Inválid Email").regex(emailRegex, "invalid email format"),
  password: z
    .string()
    .min(8, "The password must be at least 8 characters long"),
});
