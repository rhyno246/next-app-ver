import { prisma } from "@/prisma/db";
import { CreateCategory, UpdateCategory } from "@/types/type";
import { deleteById, deleteByIds } from "@/utils/deleteHelper";
import { generateSlug } from "@/utils/helper";
export const CategoryMutation = {
    createCategory : async(_:unknown , args : {
          data : CreateCategory
        }) => {
          const author = await prisma.author.findUnique({
            where : { id : args.data.authorId }
          })
    
          const existedCategory = await prisma.category.findFirst({
            where: { name: args.data.name },
          });
          if(existedCategory){
            throw new Error("Category already in use.");
          }
    
         if (!author) throw new Error("Author not found");
         const slug = await generateSlug(args.data.name)
          return await prisma.category.create({
            data : {
              name: args.data.name,
              slug: slug,
              description: args.data.description || null,
              image: args.data.image || null,
              publicId: args.data.publicId || null,
              authorId: author?.id
            },
            include : {
              author : true
            }
          })
        },
    
    updateCategory : async(_: unknown, args : {
        data : UpdateCategory
    }) => {
        const { id, name, description, image, publicId, authorId } = args.data;
        const category = await prisma.category.findUnique({
            where: { id }
        });
        if (!category) {
            throw new Error("Category not found");
        }
        if (authorId) {
            const author = await prisma.author.findUnique({
                where: { id: authorId }
            });
            if (!author) throw new Error("Author not found");
        }
        const slug = await generateSlug(args.data.name)
        return await prisma.category.update({
            where: { id },
            data: {
                name: name ?? undefined,
                slug: slug ?? undefined,
                description: description ?? undefined,
                image: image ?? undefined,
                publicId: publicId ?? undefined,
                authorId: authorId
            },
            include: {
                author: true
            }
        });
    },
    deleteCategory : async(_:unknown , args : {
      id : string
    }) => {
      return await deleteById({
        model: "category",
        id: args.id,
        beforeDelete: async (id) => {
            await prisma.productCategory.deleteMany({ where: { categoryId: id } });
        },
      });
    },
    deleteCategories: async (_: unknown, args: { ids: string[] }) => {
      return await deleteByIds({
          model: "category",
          ids: args.ids,
          beforeDelete: async (id) => {
            await prisma.productCategory.deleteMany({ where: { categoryId: id } });
          },
      });
    },
    
}