import { prisma } from "@/prisma/db";
import { paginate } from "@/utils/pagination";

export const OrderQuery = {
    orders: async (_: unknown, args: {
        page?: number;
        pageSize?: number;
        search?: string;
        status?: string;
        authorId?: string;
    }) => {
        const where = {
            ...(args.search ? { code: { equals: parseInt(args.search) || undefined } } : {}),
            ...(args.status ? { status: args.status } : {}),
            ...(args.authorId ? { authorId: args.authorId } : {}),
        };
        return await paginate({
            model: prisma.order,
            args,
            where,
            include: {
                author: true,
                items: {
                    include: { 
                        product: true 
                    }
                }
            },
        });
    },
    order: async (_: unknown, args: { id: string }) => {
        return prisma.order.findUnique({
            where: { id: args.id },
            include: {
                author: true,
                items: {
                    include: {
                        product: {
                            include: { 
                                images: true 
                            }
                        }
                    }
                }
            }
        });
    },
    myOrders: async (_: unknown, args: {
        authorId: string;
        page?: number;
        pageSize?: number;
        status?: string;
    }) => {
        const where = {
            authorId: args.authorId,
            ...(args.status ? { status: args.status } : {}),
        };

        return await paginate({
            model: prisma.order,
            args,
            where,
            include: {
                items: {
                    include: {
                        product: {
                            include: { 
                                images: true 
                            }
                        }
                    }
                }
            },
        });
    },
    adminOrders: async (_: unknown, args: {
        page?: number;
        pageSize?: number;
        search?: string;
    }) => {
        const where = args.search ? {
            shippingEmail: { contains: args.search, mode: "insensitive" as const }
        } : {};

        return await paginate({
            model: prisma.order,
            args,
            where,
            include: {
                items: {
                    include: {
                        product: {
                            include: { 
                                images: true 
                            }
                        }
                    }
                }
            },
        });
    },
    weeklyOrders: async (_: unknown, args: { authorId: string }) => {
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

                const count = await prisma.order.count({
                    where: {
                        authorId: args.authorId,
                        createdAt: { gte: month, lt: nextMonth },
                    }
                });

                return {
                    // day: month.toLocaleDateString("en-US", { month: "short" }), // Jan, Feb...
                    month: month.toLocaleDateString("en-US", { month: "short" }),
                    orders: count,
                };
            })
        );

        return results;
    },
    topOrderUsers: async (_: unknown, args: { limit?: number }) => {
        const limit = args.limit ?? 5;
        const topUsers = await prisma.order.groupBy({
            by: ["authorId"],
            _count: {
                authorId: true,
            },
            _sum: {
                total: true, 
            },
            orderBy: {
                _count: {
                    authorId: "desc",
                },
            },
            take: limit,
        });
        const results = await Promise.all(
            topUsers
                .filter((entry) => entry.authorId !== null)
                .map(async (entry) => {
                    const author = await prisma.author.findUnique({
                        where: { id: entry.authorId as string }, 
                    });
                    return {
                        author,
                        orderCount: entry._count.authorId,
                        totalAmount: entry._sum.total ?? 0,
                    };
                })
        );
        return results;
    },
    monthlyOrders: async () => {
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

                const [count, revenue] = await Promise.all([
                    prisma.order.count({
                        where: { createdAt: { gte: month, lt: nextMonth } },
                    }),
                    prisma.order.aggregate({
                        where: { createdAt: { gte: month, lt: nextMonth } },
                        _sum: { total: true },
                    }),
                ]);

                return {
                    month: month.toLocaleDateString("en-US", { month: "short" }),
                    orders: count,
                    revenue: revenue._sum.total ?? 0,
                };
            })
        );

        return results;
    },
}