import { prisma } from "@/prisma/db";
import { CreateComments } from "@/types/type";


const recalculateProductRating = async (productId: string) => {
    const allComments = await prisma.comment.findMany({
        where: { productId },
        select: { rating: true }
    });

    const total = allComments.length;
    const sum = allComments.reduce((acc, c) => acc + (c.rating ?? 0), 0);
    const average = total > 0 ? Math.round(sum / total) : 0;

    await prisma.product.update({
        where: { id: productId },
        data: { rating: average }
    });
};

export const CommentsMutation = {
    createComments : async(_:unknown , args : {
            data : CreateComments
        }) => {
        const { productId, content, rating, email, name, authorId } = args.data;  
        const order = await prisma.order.findFirst({
            where: {
                shippingEmail: email,
                items: {
                    some: { productId }
                }
            }
        }); 
        if (!order) {
            throw new Error("You must purchase this product before leaving a review.");
        } 
        const existingComment = await prisma.comment.findFirst({
            where: { 
                productId, 
                email 
            }
        });

     
        if (existingComment) {
            throw new Error("You have already reviewed this product.");
        }



        const newComment = await  prisma.comment.create({
            data: {
                productId,
                content,
                rating,
                email,
                name,
                authorId : authorId ?? null,
            },
            include: {
                product: true,
                author: true,
            }
        });

        await recalculateProductRating(productId);

        return newComment
    },

    

    updateStatusComments : async(_:unknown , args : {
        id : string,
        isActive : boolean
    }) => {
        const comment = await prisma.comment.update({
            where: { id: args.id },
            data: { isActive: args.isActive },
        });
        await recalculateProductRating(comment.productId);
        return comment;
    },

    updateHotComments : async(_:unknown , args : {
        id : string,
        isHot : boolean
    }) => {
        const comment = await prisma.comment.update({
            where: { id: args.id },
            data: { isHot: args.isHot },
        });
        await recalculateProductRating(comment.productId);
        return comment;
    },

    deleteComments : async(_:unknown , args : {
        id : string
    }) => {
        const comment = await prisma.comment.delete({
            where: { id: args.id }
        });
        await recalculateProductRating(comment.productId);
        return comment;
    }
}