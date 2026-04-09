// WishlistMutation.ts
import { prisma } from "@/prisma/db";

export const WishlistMutation = {
    toggleWishlist: async (_: unknown, args: { authorId: string; productId: string }) => {
        const existing = await prisma.wishlist.findUnique({
            where: {
                authorId_productId: {
                    authorId: args.authorId,
                    productId: args.productId
                }
            }
        });

        if (existing) {
            // Đã có → xóa
            await prisma.wishlist.delete({
                where: {
                    authorId_productId: {
                        authorId: args.authorId,
                        productId: args.productId
                    }
                }
            });
            return { added: false, message: "Removed from wishlist" };
        }

        // Chưa có → thêm
        await prisma.wishlist.create({
            data: {
                authorId: args.authorId,
                productId: args.productId
            }
        });
        return { added: true, message: "Added to wishlist" };
    },

    removeWishlist: async (_: unknown, args: { authorId: string; productId: string }) => {
        return prisma.wishlist.delete({
            where: {
                authorId_productId: {
                    authorId: args.authorId,
                    productId: args.productId
                }
            },
            include: { product: true },
        });
    }
};