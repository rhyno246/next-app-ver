import { prisma } from "@/prisma/db";

export const BrowserVisitMutation = {
  trackBrowserVisit: async (_: unknown, args: { browser: string }) => {
    await prisma.browserVisit.upsert({
      where: { browser: args.browser },
      update: { count: { increment: 1 } },
      create: { browser: args.browser, count: 1 },
    });
    return true;
  },
};