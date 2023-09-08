/*
  Warnings:

  - The primary key for the `GuildConfiguration` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GuildConfiguration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "welcomemsg" TEXT NOT NULL,
    "leavemsg" TEXT NOT NULL
);
INSERT INTO "new_GuildConfiguration" ("id", "leavemsg", "welcomemsg") SELECT "id", "leavemsg", "welcomemsg" FROM "GuildConfiguration";
DROP TABLE "GuildConfiguration";
ALTER TABLE "new_GuildConfiguration" RENAME TO "GuildConfiguration";
CREATE UNIQUE INDEX "GuildConfiguration_id_key" ON "GuildConfiguration"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
