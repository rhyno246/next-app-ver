import z from "zod";

export const settingSchema = z.object({
    key: z.string().min(1, "Key is required"),
    value: z.string().optional(),
    publicId: z.string().optional()
});

export type SettingSchema = z.infer<typeof settingSchema>;