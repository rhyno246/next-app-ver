import { prisma } from "@/prisma/db";

export const ShippingAddressQuery = {
  shippingAddress: async () => {
    return prisma.shippingAddress.findMany({
      include: { author: true }
    });
  }
};