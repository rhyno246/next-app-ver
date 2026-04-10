import { prisma } from "@/prisma/db";
import { Context } from "@/types/type";
import { paginate } from "@/utils/pagination";

export const AuthorQuery = {
  author: async (_: unknown, args: { id: string }) => {
    return await prisma.author.findUnique({
      where: { id: args.id }, include : {
        role : true,
        shippingAddress: true,
        comments : true,
        wishlists : true
      },
    });
  },
  me: async (_: unknown, __: unknown, context: Context) => {
    if (!context.authorId) return null;
    const user = await prisma.author.findUnique({
      where: { id: context.authorId },
      include: { 
        role: true , 
        shippingAddress: true, 
        wishlists : true,
        comments : true
      },
    });
    return user;
  },
  adminAuthor : async (_: unknown, args: {
    page?: number;
    pageSize?: number;
    search?: string;
  }) => {
    const where = args.search ? {
        email: { contains: args.search, mode: "insensitive" as const }
    } : {};

    return await paginate({
        model: prisma.author,
        args,
        where,
        include: {  
          role : true,
          shippingAddress: true, 
           wishlists : true,
            comments : true
        },
    });
  },
  adminRole: async () => {
    return await prisma.role.findMany();
  },
  authorRegisterInMonth: async () => {
    const months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(i);
        date.setDate(1);
        date.setHours(0, 0, 0, 0);
        return date;
    });

    const results = await Promise.all(
        months.map(async (month) => {
            const nextMonth = new Date(month);
            nextMonth.setMonth(nextMonth.getMonth() + 1);

            const count = await prisma.author.count({
                where: {
                    createdAt: { gte: month, lt: nextMonth },
                },
            });

            return {
                month: month.toLocaleDateString("en-US", { month: "short" }),
                count,
            };
        })
    );

    return results;
  },
};