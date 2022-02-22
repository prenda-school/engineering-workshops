/*
  Warnings:

  - You are about to drop the `Presenter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Suggester` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `presenterId` on the `Presentation` table. All the data in the column will be lost.
  - You are about to drop the column `suggesterId` on the `Presentation` table. All the data in the column will be lost.
  - Added the required column `presenter` to the `Presentation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `suggester` to the `Presentation` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Presenter";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Suggester";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Presentation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "suggester" TEXT NOT NULL,
    "presenter" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "status" TEXT NOT NULL
);
INSERT INTO "new_Presentation" ("id", "notes", "status", "title") SELECT "id", "notes", "status", "title" FROM "Presentation";
DROP TABLE "Presentation";
ALTER TABLE "new_Presentation" RENAME TO "Presentation";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
