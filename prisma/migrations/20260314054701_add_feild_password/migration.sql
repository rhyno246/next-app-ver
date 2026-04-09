-- AlterTable
ALTER TABLE "Author" ADD COLUMN     "password" TEXT,
ALTER COLUMN "email" DROP NOT NULL;
