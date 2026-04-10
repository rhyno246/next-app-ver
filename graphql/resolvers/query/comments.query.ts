import { prisma } from "@/prisma/db";
import { paginate } from "@/utils/pagination";

export const CommentsQuery = {
    getComments : async(_:unknown , args : {
        productId : string
    }) => {
        return prisma.comment.findMany({
            where: {
                productId: args.productId,
                isActive: true,
            },
            include: { author: true },
            orderBy: { createdAt: "desc" }
        });
    },

    getCommentAdmins: async (_: unknown, args: {
        page?: number;
        pageSize?: number;
        search?: string;
    }) => {
        const where = args.search ? {
            email: { contains: args.search, mode: "insensitive" as const }
        } : {};

        return await paginate({
            model: prisma.comment,
            args,
            where,
            include: {
                product: true,
                author: true,
            },
        });
    },
    canComment: async (_: unknown, args: { productId: string; email: string }) => {
        const order = await prisma.order.findFirst({
            where: {
                shippingEmail: args.email,
                items: { 
                    some: { 
                        productId: args.productId 
                    } 
                }
            }
        });

        const existingComment = await prisma.comment.findFirst({
            where: { 
                productId: args.productId, 
                email: args.email 
            }
        });

        return {
            canComment: !!order && !existingComment,
            hasPurchased: !!order,
            hasCommented: !!existingComment,
        };
    },
    getHomePageComments: async () => {
        return await prisma.comment.findMany({
            where: { 
                isActive: true,
                isHot : true
            },
            include: { 
                author: true
             },
            orderBy: { 
                createdAt: "desc" 
            },
            take: 6,
        });
    },
    getAllComments: async () => {
        return await prisma.comment.findMany({
            include: {
                product: true,
                author: true,
            },
            orderBy: { createdAt: "desc" },
        });
    },
}