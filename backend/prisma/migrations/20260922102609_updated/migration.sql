/*
  Warnings:

  - You are about to drop the column `variantId` on the `cart_items` table. All the data in the column will be lost.
  - You are about to drop the column `sku` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `variantId` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `variantName` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the `product_variants` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[cartId,productId]` on the table `cart_items` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productId` to the `cart_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_variantId_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_variantId_fkey";

-- DropForeignKey
ALTER TABLE "product_variants" DROP CONSTRAINT "product_variants_productId_fkey";

-- DropIndex
DROP INDEX "cart_items_cartId_variantId_key";

-- DropIndex
DROP INDEX "cart_items_variantId_idx";

-- DropIndex
DROP INDEX "order_items_variantId_idx";

-- AlterTable
ALTER TABLE "cart_items" DROP COLUMN "variantId",
ADD COLUMN     "productId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "sku",
DROP COLUMN "variantId",
DROP COLUMN "variantName",
ADD COLUMN     "productId" INTEGER;

-- DropTable
DROP TABLE "product_variants";

-- CreateIndex
CREATE INDEX "cart_items_productId_idx" ON "cart_items"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_cartId_productId_key" ON "cart_items"("cartId", "productId");

-- CreateIndex
CREATE INDEX "order_items_productId_idx" ON "order_items"("productId");

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
