import { paginate } from "@/utils/pagination";
import { prisma } from "@/prisma/db";

export const ProductQuery = {
    products: async (_: unknown, args: {
        page?: number;
        pageSize?: number;
        search?: string;
        categories?: string[];
    }) => {
        const where = {
          isActive: true,
          ...(args.search ? { title: { contains: args.search, mode: "insensitive" as const } } : {}),
          ...(args.categories?.length ? {
            categories: {
              some: {
                categoryId: { in: args.categories }
              }
            }
          } : {}),
        };
        if (!args.page && !args.pageSize) {
          const data = await prisma.product.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
              author: true,
              categories: { include: { category: true } },
              images: true,
            },
          });
          return {
            data,
            total: data.length,
            page: 1,
            pageSize: data.length,
            totalPages: 1,
          };
        }

        return await paginate({
          model: prisma.product,
          args,
          where,
          include: {
            author: true,
            categories: { 
              include: { 
                category: true 
              } 
            },
            images: true,
          },
        });
    },
    saleProducts: async () => {
        const data = await prisma.product.findMany({
          where: { 
            isActive: true,
            sale: { gt: 0 } 
          },
          orderBy: { 
            createdAt: "desc" 
          },
          take: 2,
          include: {
            categories: {
                include: { category: true }
            },
            images: true,
            author: true
          }
        });
        return data;
    },
    newArrivals : async () => {
      return prisma.product.findMany({
          where: { isActive: true },
          orderBy: { createdAt: "desc" },
          take: 8,
          include: {
              categories: {
                  include: { category: true }
              },
              images: true,
              author: true
          }
      });
    },
    productDetail : async (_: unknown, args: {
        slug : string
    }) => {
        return await prisma.product.findUnique({
            where: {
              slug: args.slug,
              isActive: true
            },
            include: {
              categories: {
                include: { category: true }
              },
              images: true,
              author: true  
            },
        });
    },
    productBestSeller : async () => {
      return await prisma.product.findMany({
        where: {
          isActive: true,
          soldCount: { gt: 0 }
        },
        orderBy: {
          soldCount: "desc"
        },
        take: 8,
        include: {
              categories: {
                  include: { category: true }
              },
              images: true,
              author: true
          }
      });

    }
};