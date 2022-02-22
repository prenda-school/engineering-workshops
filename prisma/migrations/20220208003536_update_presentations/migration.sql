/*
  Warnings:

  - You are about to drop the column `presenter` on the `Presentation` table. All the data in the column will be lost.
  - You are about to drop the column `suggester` on the `Presentation` table. All the data in the column will be lost.
  - Added the required column `presenterId` to the `Presentation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `suggesterId` to the `Presentation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Suggester" (
    "presentationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("presentationId", "userId"),
    CONSTRAINT "Suggester_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Presenter" (
    "presentationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("presentationId", "userId"),
    CONSTRAINT "Presenter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Presentation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "suggesterId" TEXT NOT NULL,
    "presenterId" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "Presentation_suggesterId_id_fkey" FOREIGN KEY ("suggesterId", "id") REFERENCES "Suggester" ("userId", "presentationId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Presentation_presenterId_id_fkey" FOREIGN KEY ("presenterId", "id") REFERENCES "Presenter" ("userId", "presentationId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Presentation" ("id", "notes", "status", "title") SELECT "id", "notes", "status", "title" FROM "Presentation";
DROP TABLE "Presentation";
ALTER TABLE "new_Presentation" RENAME TO "Presentation";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
