import { z } from "zod";

export const shippingAddressSchema = z.object({
  name: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(30, "First name must not exceed 30 characters"),

  email: z
    .string()
    .email("Invalid email address"),

  phone: z
    .string()
    .min(9, "Phone number must be at least 9 digits")
    .max(11, "Phone number must not exceed 11 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
    address: z.string().trim().min(1, "Address is required")
});

export type ShippingAddressSchema = z.infer<typeof shippingAddressSchema>;