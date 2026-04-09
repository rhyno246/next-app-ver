import { prisma } from "@/prisma/db";
import { ProductParent } from "@/types/type";

export const ProductModel = {
    categories: async (parent : ProductParent) => {
        return await prisma.productCategory.findMany({
            where: { productId: parent.id },
            include: { category: true }
        });
    }
};