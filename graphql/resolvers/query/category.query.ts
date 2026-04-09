import { prisma } from "@/prisma/db";
import { paginate } from "@/utils/pagination";

export const CategoryQuery = {
  categories: async () => {
    return prisma.category.findMany({
      include: { author: true }
    });
  },
  adminCategories: async (_: unknown, args: {
        page?: number;
        pageSize?: number;
        search?: string;
    }) => {
        const where = args.search ? {
            name: { contains: args.search, mode: "insensitive" as const }
        } : {};

        return await paginate({
            model: prisma.category,
            args,
            where,
            include: { author: true },
        });
    },
    categoryBySlug: async (_: unknown, args: { slug: string }) => {
        return await prisma.category.findUnique({
            where: { slug: args.slug },
            include: { author: true },
        });
    }
};