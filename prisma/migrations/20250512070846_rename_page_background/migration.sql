/*
  Warnings:

  - You are about to drop the column `pageBackground` on the `Character` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Character" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "lastName" TEXT,
    "title" TEXT,
    "race" TEXT,
    "class" TEXT,
    "faction" TEXT,
    "alignment" TEXT,
    "background" TEXT,
    "description" TEXT,
    "mainImage" TEXT,
    "headerBackground" TEXT,
    "images" TEXT NOT NULL DEFAULT '[]',
    "videos" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "authorId" TEXT NOT NULL,
    "tags" TEXT NOT NULL DEFAULT '[]',
    CONSTRAINT "Character_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Character" ("alignment", "authorId", "background", "class", "createdAt", "description", "faction", "id", "images", "lastName", "mainImage", "name", "race", "tags", "title", "updatedAt", "videos") SELECT "alignment", "authorId", "background", "class", "createdAt", "description", "faction", "id", "images", "lastName", "mainImage", "name", "race", "tags", "title", "updatedAt", "videos" FROM "Character";
DROP TABLE "Character";
ALTER TABLE "new_Character" RENAME TO "Character";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
