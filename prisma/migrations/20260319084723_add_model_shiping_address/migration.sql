-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "publicId" TEXT;

-- CreateTable
CREATE TABLE "ShippingAddress" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShippingAddress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShippingAddress_authorId_key" ON "ShippingAddress"("authorId");

-- AddForeignKey
ALTER TABLE "ShippingAddress" ADD CONSTRAINT "ShippingAddress_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;
