import { prisma } from "@/prisma/db";
import { paginate } from "@/utils/pagination";

export const SlideQuery = {
    slides: async (_: unknown, args: {
        page?: number;
        pageSize?: number;
        search?: string;
    }) => {
        const where = args.search ? {
            name: { contains: args.search, mode: "insensitive" as const }
        } : {};

        return await paginate({
            model: prisma.slide,
            args,
            where,
            include: { author: true },
        });
    },
    allSlides: async () => {
        const data = await prisma.slide.findMany({
            where: { isActive: true },
            orderBy: { createdAt: "desc" },
        });
        return data;
    },
};