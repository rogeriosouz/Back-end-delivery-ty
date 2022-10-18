-- AlterTable
ALTER TABLE "Product" ADD COLUMN "quantProductsId" TEXT;

-- CreateTable
CREATE TABLE "QuantProducts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quant" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productsId" TEXT NOT NULL,
    CONSTRAINT "QuantProducts_productsId_fkey" FOREIGN KEY ("productsId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "QuantProducts_productsId_key" ON "QuantProducts"("productsId");
