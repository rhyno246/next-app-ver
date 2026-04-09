import z from "zod";

export const productsSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    sale: z.number().optional(),
    price: z.number().min(1, "Price must be greater than 0"),
    stock: z.number().min(0, "Stock must be greater than or equal to 0"),
    categories: z.array(z.string()).min(1, "Select at least one category"),
});

export type ProductsSchema = z.infer<typeof productsSchema>;