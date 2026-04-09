import cloudinary from "@/utils/cloudinary";
import { prisma } from "@/prisma/db";

type ModelName = "category" | "product" | "post" | "slide" | "siteConfig";

type DeleteOptions = {
    model: ModelName;
    id: string;
    beforeDelete?: (id: string) => Promise<void>;
};

type PrismaDelegate = {
    findUnique: (args: { where: { id: string } }) => Promise<{ publicId?: string | null } | null>;
    delete: (args: { where: { id: string } }) => Promise<unknown>;
};

export const deleteById = async ({ model, id, beforeDelete }: DeleteOptions) => {
    const delegate = prisma[model] as unknown as PrismaDelegate;

    const item = await delegate.findUnique({ where: { id } });
    if (!item) throw new Error(`${model} ${id} not found`);

    if (item.publicId) {
        await cloudinary.uploader.destroy(item.publicId);
    }

    if (beforeDelete) {
        await beforeDelete(id);
    }

    return await delegate.delete({ where: { id } });
};

export const deleteByIds = async ({ model, ids, beforeDelete }: {
    model: ModelName;
    ids: string[];
    beforeDelete?: (id: string) => Promise<void>;
}) => {
    return await Promise.all(ids.map((id) => deleteById({ model, id, beforeDelete })));
};