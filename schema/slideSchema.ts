import z from "zod";

export const slideSchema = z.object({
    title: z.string().min(1, "Title is required"),
    link: z.string().optional(),
    publicId : z.string().optional(),
});

export type SlideSchema = z.infer<typeof slideSchema>;
