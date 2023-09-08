-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GuildConfiguration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "welcomemsg" TEXT NOT NULL DEFAULT '',
    "leavemsg" TEXT NOT NULL DEFAULT '',
    "welcomechannel" TEXT NOT NULL DEFAULT '',
    "leavechannel" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_GuildConfiguration" ("id", "leavemsg", "welcomemsg") SELECT "id", "leavemsg", "welcomemsg" FROM "GuildConfiguration";
DROP TABLE "GuildConfiguration";
ALTER TABLE "new_GuildConfiguration" RENAME TO "GuildConfiguration";
CREATE UNIQUE INDEX "GuildConfiguration_id_key" ON "GuildConfiguration"("id");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT '',
    "cash" INTEGER DEFAULT 0
);
INSERT INTO "new_User" ("cash", "id") SELECT "cash", "id" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
