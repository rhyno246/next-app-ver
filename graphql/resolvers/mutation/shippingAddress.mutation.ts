import { prisma } from "@/prisma/db";
import { ShippingAddressType } from "@/types/type";

export const ShippingAddressMutation = {
    updateShippingAddress: async (_: unknown, args: { data  : ShippingAddressType}) => {
        const { authorId , name , email, phone , address } = args.data;
         // ✅ Upsert — nếu chưa có thì tạo mới, có rồi thì update
        const shipping =  await prisma.shippingAddress.upsert({
            where: { authorId },
            update: { name, email, phone, address },
            create: { authorId, name, email, phone, address },
        });
        return shipping;
    }
}