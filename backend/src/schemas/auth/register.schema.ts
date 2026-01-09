import { email, z } from "zod";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex = /^[A-Za-z0-9]+$/;

export const registerSchema = z.object({
  name: z
    .string()
    .min(5, "the name must have at least 5 letters")
    .regex(nameRegex, "the name can only contain letters and numbers"),

  email: z.email("Invalid Email"),

  password: z
    .string()
    .min(8, "The password must be at least 8 characters long")
    .regex(/[A-Z]/, "must contain at least one uppercase letter")
    .regex(/[a-z]/, "must contain at least one lowercase letter")
    .regex(/[0-9]/, "must contain at least one number"),

  institution: z
    .string()
    .min(2, "The institution must have at least 2 characters"),

  bio: z
    .string()
    .max(500, "The biography can only have a maximum of 500 characters")
    .optional(),
});
