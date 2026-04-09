import { PrismaClient } from "../app/generated/prisma/client";

const prisma = new PrismaClient({
   accelerateUrl: process.env.DATABASE_URL!,
});

async function main() {
  // Insert role user
  await prisma.role.upsert({
    where: { name: "type_user" },
    update: {},
    create: { name: "type_user" },
  });

  // Insert role admin
  await prisma.role.upsert({
    where: { name: "type_admin" },
    update: {},
    create: { name: "type_admin" },
  });
  // Insert role system default role
  await prisma.role.upsert({
    where: { name: "type_system" },
    update: {},
    create: { name: "type_system" },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });