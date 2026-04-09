import { prisma } from "@/prisma/db"
import { CreatePosts, UpdatePost } from "@/types/type"
import { deleteById, deleteByIds } from "@/utils/deleteHelper"
import { generateSlug } from "@/utils/helper"

export const PostsMutation = {
    createPost : async(_:unknown , args : {
        data : CreatePosts
    }) => {
        const { title, content,image, publicId, authorId } = args.data;
        const existedPosts = await prisma.post.findFirst({
            where : {title : title }
        })
        const slug = await generateSlug(args.data.title)
        if(existedPosts){
            throw new Error("Post already in use.");
        }
        const posts =  await prisma.post.create({
            data :{
                title : title,
                image : image ?? undefined,
                publicId: publicId ?? undefined,
                slug : slug,
                content : content ?? undefined,
                authorId: authorId,
            },
            include : {
                author : true
            }
         })
         return posts;
    },
    updatePost :  async(_:unknown , args : {
        data : UpdatePost
    }) => {
        const { id, title , content , image } = args.data;
        const updatedPost = await prisma.post.update({
            where: { id },
            data : {
                title : title,
                content : content ?? undefined,
                image : image ?? undefined
            },
            include: { author: true}
        })
        return updatedPost;
    },

    deletePost: async (_: unknown, args: { id: string }) => {
        return await deleteById({ model: "post", id: args.id });
    },

    deletePosts: async (_: unknown, args: { ids: string[] }) => {
        return await deleteByIds({ model: "post", ids: args.ids });
    },
}