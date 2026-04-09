

import { prisma } from "@/prisma/db";
import { CategoryParent } from "@/types/type";

export const CategoryModel = {
    products: async (parent : CategoryParent) => {
        return await prisma.productCategory.findMany({
            where: { categoryId: parent.id },
            include: { product: true }
        });
    }
};