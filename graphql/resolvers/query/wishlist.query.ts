import { prisma } from "@/prisma/db";

export const WishlistQuery = {
    wishlists: async (_: unknown, args: { authorId: string }) => {
        return prisma.wishlist.findMany({
            where: { authorId: args.authorId },
            include: {
                product: {
                    include: {
                        categories: { include: { category: true } },
                        images: true,
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });
    },

    wishlist: async (_: unknown, args: { authorId: string; productId: string }) => {
        return prisma.wishlist.findUnique({
            where: {
                authorId_productId: {
                    authorId: args.authorId,
                    productId: args.productId
                }
            }
        });
    }
};