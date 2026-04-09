import { prisma } from "@/prisma/db";
import { UpdateAndCrteateConfig } from "@/types/type";
import { deleteById, deleteByIds } from "@/utils/deleteHelper";
import { SITE_CONFIG_DEFAULTS } from "@/utils/siteconfig";

export const SiteConfigMutation = {
    upsertSiteConfig: async (_: unknown, args: { configs: UpdateAndCrteateConfig }) => {
        const { key, value, publicId, authorId } = args.configs ?? args;
        console.log(args)
        return prisma.siteConfig.upsert({
            where: {
                key: key
            },
            update: {
                key: key, 
                value: value, 
                publicId : publicId,
                authorId: authorId
            },
            create: { 
                key: key, 
                value: value, 
                publicId : publicId,
                authorId: authorId,
            },
            include : {
                author : true
            }
        });
    },

    upsertSiteConfigs: async (_: unknown, args: { configs: UpdateAndCrteateConfig[] }) => {
       console.log(args)
        return await Promise.all(
            args.configs.map((config) =>
                prisma.siteConfig.upsert({
                    where: { 
                        key: config.key 
                    },
                    update: { 
                        key: config.key, 
                        value: config.value, 
                        publicId : config.publicId,
                        authorId: config.authorId
                    },
                    create: { 
                        key: config.key, 
                        value: config.value, 
                        publicId : config.publicId,
                        authorId: config.authorId
                    },
                    include : {
                        author : true
                    }
                })
            )
        );
    },
    deleteSiteConfig: async (_: unknown, args: { id: string }) => {
        const config = await prisma.siteConfig.findUnique({ where: { id: args.id } });
        if (config && SITE_CONFIG_DEFAULTS[config.key]) {
            return prisma.siteConfig.update({
                where: { id: args.id },
                data: {
                    value: SITE_CONFIG_DEFAULTS[config.key],
                    publicId: null,
                },
                include: { author: true }
            });
        }
        return await deleteById({ model: "siteConfig", id: args.id });
    },

    deleteSiteConfigs: async (_: unknown, args: { ids: string[] }) => {
        const configs = await prisma.siteConfig.findMany({ where: { id: { in: args.ids } } });
        const toReset = configs.filter((c) => SITE_CONFIG_DEFAULTS[c.key]);
        const toDelete = configs.filter((c) => !SITE_CONFIG_DEFAULTS[c.key]);
        await Promise.all(
            toReset.map((c) =>
                prisma.siteConfig.update({
                    where: { id: c.id },
                    data: {
                        value: SITE_CONFIG_DEFAULTS[c.key],
                        publicId: null,
                    },
                })
            )
        );
        if (toDelete.length > 0) {
            await deleteByIds({ model: "siteConfig", ids: toDelete.map((c) => c.id) });
        }

        return [...toReset, ...toDelete];
    },
};