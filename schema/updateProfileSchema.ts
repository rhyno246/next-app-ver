import { z } from "zod";

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(30, "First name must not exceed 30 characters"),

  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(30, "Last name must not exceed 30 characters"),

  // email: z
  //   .string()
  //   .email("Invalid email address"),

  phone: z
    .string()
    .min(9, "Phone number must be at least 9 digits")
    .max(11, "Phone number must not exceed 11 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
});

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;