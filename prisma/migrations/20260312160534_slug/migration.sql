/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Post` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "code" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Order_code_key" ON "Order"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");
