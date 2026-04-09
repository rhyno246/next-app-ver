import { OrderStatus } from "@/app/generated/prisma/enums";
import { prisma } from "@/prisma/db";
import { CreateOrderInput } from "@/types/type";
import { sendOrderEmail, sendOrderStatusEmail } from "@/utils/sendOrderEmail";

export const OrderMutation = {
    createOrder: async (_: unknown, args: { 
        data: CreateOrderInput 
    }) => {
        const { authorId, items, paymentMethod, note, discount = 0} = args.data;
        const shippingFeeMap: Record<string, number> = {
            "free": 0,
            "fedex": 11,   
            "dhl": 13, 
            "cod": 0,
        };
       

        const productIds = items.map(i => i.productId);
        const products = await prisma.product.findMany({
            where: { 
                id: { in: productIds } 
            }
        });
        for (const item of items) {
            const product = products.find(p => p.id === item.productId);
            if (!product) throw new Error(`Product ${item.productId} not found`);
            if ((product.stock ?? 0) < item.quantity) {
                throw new Error(`Product ${product.title} is out of stock`);
            }
        }
        const orderItems = items.map(item => {
            const product = products.find(p => p.id === item.productId)!;
            const price = product.price ?? 0;
            const sale = product.sale ?? 0;
            const finalPrice = sale > 0 ? price - (price * sale / 100) : price;
            const total = Math.round(finalPrice * item.quantity);
            return {
                productId: item.productId,
                quantity: item.quantity,
                price,
                sale,
                total,
            };
        });
        
        const shippingFee = shippingFeeMap[paymentMethod ?? "free"] ?? 0;
        const subtotal = orderItems.reduce((sum, i) => sum + i.total, 0);
        const total = subtotal - discount + shippingFee;
        const order = await prisma.order.create({
            data: {
                authorId : authorId ?? null,
                subtotal,
                total,
                discount,
                shippingFee,
                paymentMethod: paymentMethod ?? "cod",
                note,
                shippingName: args.data.shippingName,
                shippingPhone: args.data.shippingPhone,
                shippingEmail: args.data.shippingEmail,
                shippingAddress: args.data.shippingAddress,
                items: {
                    create: orderItems
                }
            },
            include: {
                items: {
                    include: { product: true }
                },
                author: true,
            }
        });
        await Promise.all(
            items.map(item =>
                prisma.product.update({
                    where: { id: item.productId },
                    data: {
                        soldCount: { increment: item.quantity },
                        stock: { decrement: item.quantity },
                    }
                })
            )
        );

        try {
            await sendOrderEmail({
                to: args.data.shippingEmail ?? "",
                code: order.code,
                shippingName: args.data.shippingName ?? "",
                shippingAddress: args.data.shippingAddress ?? "",
                shippingPhone: args.data.shippingPhone ?? "",
                shippingFee: shippingFee, 
                total: order.total,
                items: orderItems.map((item) => {
                    const product = products.find(p => p.id === item.productId);
                    return {
                        title: product?.title ?? "Unknown Product",
                        quantity: item.quantity,
                        price: item.price,
                        sale: item.sale,
                    };
                }),
            });
        } catch (e) {
            console.error("Send order email failed:", e);
        }


        return order;
    },
    updateOrderStatus: async (_: unknown, args: { id: string; status: string }) => {
        const order = await prisma.order.update({
            where: { id: args.id },
            data: { status: args.status as OrderStatus },
            include: {
                items: { include: { product: true } },
                author: true,
            }
        });

        try {
            if (order.shippingEmail) {
                await sendOrderStatusEmail({
                    to: order.shippingEmail,
                    code: order.code,
                    status: args.status,
                    shippingName: order.shippingName ?? "Customer",
                });
            }
        } catch (e) {
            console.error("Send status email failed:", e);
        }

        return order;
    },
    cancelOrder: async (_: unknown, args: { id: string; authorId: string }) => {
        const order = await prisma.order.findUnique({
            where: { id: args.id },
            include: { items: true }
        });

        if (!order) throw new Error("Order not found");
        if (order.authorId !== args.authorId) throw new Error("Unauthorized");
        if (order.status !== "PENDING") throw new Error("Can only cancel pending orders");

        // Restore stock
        await Promise.all(
            order.items.map(item =>
                prisma.product.update({
                    where: { id: item.productId },
                    data: {
                        soldCount: { decrement: item.quantity },
                        stock: { increment: item.quantity },
                    }
                })
            )
        );

        return prisma.order.update({
            where: { id: args.id },
            data: { status: "CANCELLED" },
            include: {
                items: { include: { product: true } },
                author: true,
            }
        });
    },
    deleteOrder: async (_: unknown, args: { id: string }) => {
        return prisma.order.delete({
            where: { id: args.id }
        });
    }
}