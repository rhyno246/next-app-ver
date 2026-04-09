import z from "zod";

export const checkoutSchema  = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    address: z.string().min(1, "Address is required"),
    phone: z.string().min(1, "Phone is required"),
    email: z.string().email("Invalid email"),
    note: z.string().optional(),
});

export type CheckoutSchema  = z.infer<typeof checkoutSchema >;