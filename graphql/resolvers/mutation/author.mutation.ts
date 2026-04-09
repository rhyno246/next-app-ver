import { prisma } from "@/prisma/db";
import bcrypt from "bcryptjs";
import { providerConfig, roleType } from "@/Enum/enum";
import {
  CreateAuthor,
  UpdateAuthor,
} from "@/types/type";

export const AuthorMutation = {
  createAuthor: async (_: unknown, args: { data: CreateAuthor }) => {
    const defaultRole = await prisma.role.findUnique({ 
        where : { name : roleType.type_user }
    })

    const existedEmail = await prisma.author.findUnique({
        where: { email: args.data.email },
    });
    const hashed = await bcrypt.hash(args.data.password, 10);
        
    if (existedEmail) {
        throw new Error("Email already in use.");
    }
    if (!defaultRole) {
        throw new Error("Default role `type_user` not found.");
    }
    return await prisma.author.create({
        data : {
            firstName : args.data.firstName,
            lastName : args.data.lastName,
            email : args.data.email,
            password : hashed,
            phone : args.data.phone,
            image : args.data.image  || null,
            roleId : defaultRole?.id
        }
    })
  },

  updateAuthor: async (_: unknown, args: { data: UpdateAuthor }) => {
    const { id, password , oldPassword, ...rest } = args.data;
    console.log(oldPassword)
    const existedAuthor = await prisma.author.findUnique({
      where: { id: id }
    });
    if (!existedAuthor) {
        throw new Error("Author not found");
    }

    const updateData: Record<string, unknown> = Object.fromEntries(
        Object.entries(rest).filter(([_, v]) => v !== undefined)
    );
    if (existedAuthor.provider === providerConfig.local_provider && oldPassword) {
      const isMatch = await bcrypt.compare(oldPassword ?? "", existedAuthor?.password ?? "");
      if (!isMatch) throw new Error("Old password is incorrect");
      updateData.password = await bcrypt.hash(password, 10);
    }
    if (password && existedAuthor.provider !== providerConfig.local_provider){
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(updateData).length === 0) {
      throw new Error("No fields to update");
    }

    return await prisma.author.update({
        where : {id : args.data.id},
        data :updateData
    })
  },

  deleteAuthor : async(_:unknown, args : {
      id : string
    }) => {
      const { id } = args;
      const author = await prisma.author.findUnique({
        where: { id }
      });
      const authorId = process.env.ROLE_TYPE_SYSTEM!
      const systemAuthor = await prisma.author.findFirst({
        where: { roleId: authorId }
      });
      if (!author) {
        throw new Error("Author not found");
      }
      if (!authorId) throw new Error("System author ID not configured")
      await prisma.$transaction([
        // Xóa thẳng
        prisma.comment.deleteMany({ where: { authorId: id } }),
        prisma.wishlist.deleteMany({ where: { authorId: id } }),
        prisma.order.deleteMany({ where: { authorId: id } }),

        // Chuyển sang system author
        prisma.post.updateMany({ where: { authorId: id }, data: { authorId: systemAuthor?.id} }),
        prisma.product.updateMany({ where: { authorId: id }, data: { authorId: systemAuthor?.id} }),
        prisma.category.updateMany({ where: { authorId: id }, data: { authorId: systemAuthor?.id} }),
        prisma.slide.updateMany({ where: { authorId: id }, data: { authorId: systemAuthor?.id} }),

        // Cuối cùng mới xóa author
        prisma.author.delete({ where: { id } }),
      ]);
      return author;
    },
  deleteAuthors: async (_: unknown, args: { ids: string[] }) => {
    const { ids } = args;
    const authorId = process.env.ROLE_TYPE_SYSTEM!;
    if (!authorId) throw new Error("System author ID not configured");

    const systemAuthor = await prisma.author.findFirst({
        where: { roleId: authorId }
    });

    const authors = await prisma.author.findMany({
        where: { id: { in: ids } }
    });

    if (authors.length === 0) throw new Error("Authors not found");

    await prisma.$transaction([
        prisma.comment.deleteMany({ where: { authorId: { in: ids } } }),
        prisma.wishlist.deleteMany({ where: { authorId: { in: ids } } }),
        prisma.order.deleteMany({ where: { authorId: { in: ids } } }),

        prisma.post.updateMany({ where: { authorId: { in: ids } }, data: { authorId: systemAuthor?.id } }),
        prisma.product.updateMany({ where: { authorId: { in: ids } }, data: { authorId: systemAuthor?.id } }),
        prisma.category.updateMany({ where: { authorId: { in: ids } }, data: { authorId: systemAuthor?.id } }),
        prisma.slide.updateMany({ where: { authorId: { in: ids } }, data: { authorId: systemAuthor?.id } }),

        prisma.author.deleteMany({ where: { id: { in: ids } } }),
    ]);

    return authors;
  },
};