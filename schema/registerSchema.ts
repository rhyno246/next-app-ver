import { z } from "zod";

export const signupSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(30, "First name must not exceed 30 characters"),

  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(30, "Last name must not exceed 30 characters"),

  email: z
    .string()
    .email("Invalid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must not exceed 50 characters"),

  phone: z
    .string()
    .min(9, "Phone number must be at least 9 digits")
    .max(11, "Phone number must not exceed 11 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
});

export type SignupSchema = z.infer<typeof signupSchema>;