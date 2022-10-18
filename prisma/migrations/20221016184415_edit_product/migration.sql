/*
  Warnings:

  - You are about to drop the `QuantProducts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `quantProductsId` on the `Product` table. All the data in the column will be lost.
  - Added the required column `quant` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "QuantProducts_productsId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "QuantProducts";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "productUrl" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quant" INTEGER NOT NULL,
    "categoryId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requestsId" TEXT,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Product_requestsId_fkey" FOREIGN KEY ("requestsId") REFERENCES "Requests" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("categoryId", "createdAt", "description", "id", "name", "price", "productUrl", "requestsId") SELECT "categoryId", "createdAt", "description", "id", "name", "price", "productUrl", "requestsId" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
