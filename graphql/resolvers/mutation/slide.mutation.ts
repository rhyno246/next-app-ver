import { prisma } from "@/prisma/db";
import { CreateSlide, UpdateSlide } from "@/types/type";
import { deleteById, deleteByIds } from "@/utils/deleteHelper";

export const SlideMutation = {
    createSlide: async (_: unknown, args: { data: CreateSlide }) => {
        const author = await prisma.author.findUnique({
            where: { id: args.data.authorId }
        });
        if (!author) throw new Error("Author not found");

        return await prisma.slide.create({
            data: {
                title: args.data.title,
                image: args.data.image ?? null,
                link: args.data.link ?? null,
                isActive: args.data.isActive ?? true,
                publicId: args.data.publicId ?? null,
                authorId: author.id,
            },
            include: { author: true }
        });
    },

    updateSlide: async (_: unknown, args: { data: UpdateSlide }) => {
        const { id, ...rest } = args.data;

        const slide = await prisma.slide.findUnique({ where: { id } });
        if (!slide) throw new Error("Slide not found");

        const updateData: Record<string, unknown> = Object.fromEntries(
            Object.entries(rest).filter(([_, v]) => v !== undefined)
        );

        return await prisma.slide.update({
            where: { id },
            data: updateData,
            include: { author: true }
        });
    },

    deleteSlide: async (_: unknown, args: { id: string }) => {
        return await deleteById({ model: "slide", id: args.id });
    },

    deleteSlides: async (_: unknown, args: { ids: string[] }) => {
        return await deleteByIds({ model: "slide", ids: args.ids });
    },
};