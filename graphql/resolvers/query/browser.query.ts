import { prisma } from "@/prisma/db";

export const BrowserVisitQuery = {
  browserVisitStats: async () => {
    return await prisma.browserVisit.findMany({
      orderBy: { count: "desc" },
    });
  },
};