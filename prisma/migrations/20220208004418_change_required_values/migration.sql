-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Presentation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "suggester" TEXT NOT NULL,
    "presenter" TEXT,
    "notes" TEXT,
    "status" TEXT
);
INSERT INTO "new_Presentation" ("id", "notes", "presenter", "status", "suggester", "title") SELECT "id", "notes", "presenter", "status", "suggester", "title" FROM "Presentation";
DROP TABLE "Presentation";
ALTER TABLE "new_Presentation" RENAME TO "Presentation";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
