import { prisma } from "@/prisma/db";
import { CreateProduct, UpdateProduct } from "@/types/type";
import { deleteById, deleteByIds } from "@/utils/deleteHelper";
import { generateSlug } from "@/utils/helper";

export const ProductMutation = {
    createProduct : async(_:unknown , args : {
        data : CreateProduct
    }) => {
        const existedProduct = await prisma.product.findFirst({
            where : {title : args.data.title }
        })
    
        if(existedProduct){
            throw new Error("Product already in use.");
        }
    
        const slug = await generateSlug(args.data.title)
    
        return await prisma.product.create({
            data :{
                title : args.data.title,
                image : args.data.image ?? undefined,
                publicId: args.data.publicId ?? undefined,
                slug : slug,
                description : args.data.description ?? null,
                stock : args.data.stock,
                price : args.data.price ?? 0,
                rating : args.data.rating ?? 0,
                sale : args.data.sale ?? null,
                authorId: args.data.authorId,
                images: {
                    create: (args.data.imageUrls ?? []).map((url: string, index: number) => ({
                        url,
                        publicId: args.data.imagePublicIds?.[index] ?? null,
                    }))
                },
                categories : {
                    create: args.data.categories.map((categoryId :string) => ({
                        category: {
                        connect: { id: categoryId }
                        }
                    }))
                }
            },
            include : {
                categories: {
                    include: { category: true }
                },
                author : {
                    include: { role: true }
                },
                images: true
            }
         })
    },
    updateProduct: async (_: unknown, args: {
        data: UpdateProduct
    }) => {
    
        const { id, categories , imageUrls , imagePublicIds } = args.data;
        const slug = await generateSlug(args.data.title)
          // update product
        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                title: args.data.title,
                slug: slug,
                image: args.data.image ?? undefined,
                description: args.data.description ?? undefined,
                stock: args.data.stock ?? undefined,
                price: args.data.price ?? undefined,
                rating: args.data.rating ?? undefined,
                sale: args.data.sale ?? undefined,
                soldCount: args.data.soldCount ?? undefined,
                isActive: args.data.isActive ?? undefined,
                isHot: args.data.isHot ?? undefined,
                authorId: args.data.authorId
            },
            include: { 
                author: {
                    include: { role: true }
                }, 
                categories: true 
            }
        });
        if (imageUrls !== undefined) {
            await prisma.productImage.deleteMany({ where: { productId: id } });
            // Tạo images mới
            if (imageUrls.length > 0) {
                await prisma.productImage.createMany({
                    data: imageUrls.map((url: string, index: number) => ({
                        url,
                        publicId: imagePublicIds?.[index] ?? null,
                        productId: id,
                    }))
                });
            }
        }
    
          // nếu client không gửi categories → không update
        if (categories === undefined) {
            return updatedProduct;
        }
    
          // 1) Xóa hết quan hệ cũ
        await prisma.productCategory.deleteMany({
            where: { productId: id }
        });
    
          // 2) Không có category → giữ empty
        if (categories.length === 0) {
            return prisma.product.findUnique({
              where: { id },
                include: {
                    author: true,
                    categories: {
                        include: { category: true, product: true }
                    }
                }
            });
        }
    
          // 3) Thêm categories mới
        await prisma.productCategory.createMany({
            data: categories.map((categoryId) => ({
                productId: id,
                categoryId
            }))
        });
    
          // trả về product với categories mới
        return prisma.product.findUnique({
            where: { id },
            include: {
                author: {
                    include: { role: true }
                },
                categories: {
                    include: { category: true, product: true }
                }
            }
        });
    },
    deleteProduct: async (_: unknown, args: { id: string }) => {
        return await deleteById({
            model: "product",
            id: args.id,
            beforeDelete: async (id) => {
                await prisma.productCategory.deleteMany({ where: { productId: id } });
                await prisma.productImage.deleteMany({ where: { productId: id } });
            },
        });
    },

    deleteProducts: async (_: unknown, args: { ids: string[] }) => {
        return await deleteByIds({
            model: "product",
            ids: args.ids,
            beforeDelete: async (id) => {
                await prisma.productCategory.deleteMany({ where: { productId: id } });
                await prisma.productImage.deleteMany({ where: { productId: id } });
            },
        });
    },
}