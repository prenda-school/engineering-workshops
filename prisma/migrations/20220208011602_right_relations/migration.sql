/*
  Warnings:

  - You are about to drop the column `presenter` on the `Presentation` table. All the data in the column will be lost.
  - You are about to drop the column `suggester` on the `Presentation` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Presentation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "suggesterId" TEXT,
    "presenterId" TEXT,
    "notes" TEXT,
    "status" TEXT,
    CONSTRAINT "Presentation_suggesterId_fkey" FOREIGN KEY ("suggesterId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Presentation_presenterId_fkey" FOREIGN KEY ("presenterId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Presentation" ("id", "notes", "status", "title") SELECT "id", "notes", "status", "title" FROM "Presentation";
DROP TABLE "Presentation";
ALTER TABLE "new_Presentation" RENAME TO "Presentation";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
