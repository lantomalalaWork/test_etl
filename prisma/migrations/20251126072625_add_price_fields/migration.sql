/*
  Warnings:

  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - The `seller` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "price",
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "priceBrut" DOUBLE PRECISION,
ADD COLUMN     "priceNet" DOUBLE PRECISION,
DROP COLUMN "seller",
ADD COLUMN     "seller" JSONB;
