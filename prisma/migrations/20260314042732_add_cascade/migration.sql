-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_authorId_fkey";

-- DropForeignKey
ALTER TABLE "ProductCategory" DROP CONSTRAINT "ProductCategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "ProductCategory" DROP CONSTRAINT "ProductCategory_productId_fkey";

-- DropForeignKey
ALTER TABLE "SiteConfig" DROP CONSTRAINT "SiteConfig_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Slide" DROP CONSTRAINT "Slide_authorId_fkey";

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slide" ADD CONSTRAINT "Slide_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteConfig" ADD CONSTRAINT "SiteConfig_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
