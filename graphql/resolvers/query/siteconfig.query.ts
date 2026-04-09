import { prisma } from "@/prisma/db";
import { paginate } from "@/utils/pagination";
import { SITE_CONFIG_DEFAULTS } from "@/utils/siteconfig";

export const SiteConfigQuery = {
    siteConfigs: async (_: unknown, args: {
        page?: number;
        pageSize?: number;
        search?: string;
    }) => {
        const where = args.search ? {
            name: { contains: args.search, mode: "insensitive" as const }
        } : {};
        
        return await paginate({
            model: prisma.siteConfig,
            args,
            where,
            include: { author: true },
        });;
    },
    siteConfig: async (_: unknown, args: { key: string }) => {
        const config = await prisma.siteConfig.findUnique({ 
            where: { key: args.key } 
        });
        if (!config && SITE_CONFIG_DEFAULTS[args.key]) {
            return {
                id: null,
                key: args.key,
                value: SITE_CONFIG_DEFAULTS[args.key],
                publicId: null,
                authorId: null,
                author: null,
            };
        }
        return prisma.siteConfig.findUnique({ 
            where: { 
                key: args.key 
            } 
        });
    },
};