import { z } from "zod";

export const commentSchema = z.object({

  email: z
    .string()
    .email("Invalid email address"),

  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(30, "Name must not exceed 30 characters"),
  text: z
    .string()
    .min(2, "Comment must be at least 2 characters")
    .max(250, "Comment must not exceed 250 characters"),
});

export type CommentSchema = z.infer<typeof commentSchema>;