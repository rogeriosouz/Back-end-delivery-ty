/*
  Warnings:

  - You are about to alter the column `Thing` on the `Requests` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `shipping` on the `Requests` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "total" REAL NOT NULL,
    "shipping" REAL NOT NULL,
    "Thing" REAL NOT NULL,
    "products" TEXT NOT NULL,
    "typeOfPayment" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "addressId" TEXT NOT NULL,
    CONSTRAINT "Requests_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Requests" ("Thing", "addressId", "createdAt", "id", "products", "shipping", "total", "typeOfPayment", "userId") SELECT "Thing", "addressId", "createdAt", "id", "products", "shipping", "total", "typeOfPayment", "userId" FROM "Requests";
DROP TABLE "Requests";
ALTER TABLE "new_Requests" RENAME TO "Requests";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
