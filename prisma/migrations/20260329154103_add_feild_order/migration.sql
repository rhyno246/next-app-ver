/*
  Warnings:

  - The `status` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `sale` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'SHIPPING', 'SHIPPED', 'CANCELLED', 'REFUNDED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "discount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "paymentMethod" TEXT NOT NULL DEFAULT 'cod',
ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'unpaid',
ADD COLUMN     "shippingAddress" TEXT,
ADD COLUMN     "shippingEmail" TEXT,
ADD COLUMN     "shippingFee" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "shippingName" TEXT,
ADD COLUMN     "shippingPhone" TEXT,
ADD COLUMN     "subtotal" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "status",
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "sale" INTEGER NOT NULL,
ADD COLUMN     "total" INTEGER NOT NULL;
