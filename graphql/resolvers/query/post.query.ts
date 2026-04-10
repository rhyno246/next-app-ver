import { prisma } from "@/prisma/db";
import { paginate } from "@/utils/pagination";

export const PostsQuery = {
    posts: async (_: unknown, args: {
        page?: number;
        pageSize?: number;
        search?: string;
    }) => {
        const where = args.search ? {
            title: { contains: args.search, mode: "insensitive" as const }
        } : {};
        return await paginate({
            model: prisma.post,
            args,
            where,
            include: { author: true },
        });
    },
    postDetail : async (_: unknown, args: {
        slug : string
    }) => {
        return await prisma.post.findUnique({
            where: {
                slug: args.slug,
            },
            include: {
                author: true,   
            },
        });
    }
};