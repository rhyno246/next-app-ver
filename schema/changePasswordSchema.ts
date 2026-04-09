import z from "zod";

export const baseSchema = z.object({
    newpassword: z
        .string()
        .min(6, "New password must be at least 6 characters")
        .max(50, "New password must not exceed 50 characters"),
    cfnewpassword: z
        .string()
        .min(6, "Confirm password must be at least 6 characters")
        .max(50, "Confirm password must not exceed 50 characters"),
    password: z.string()
        .min(6, "password must be at least 6 characters")
        .max(50, "password must not exceed 50 characters"),
});

export type ChangePasswordSchema = z.infer<typeof baseSchema>;