-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StatisticsChannels" (
    "cid" TEXT NOT NULL PRIMARY KEY,
    "gid" TEXT NOT NULL DEFAULT '',
    "content" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_StatisticsChannels" ("cid", "content", "gid") SELECT "cid", "content", "gid" FROM "StatisticsChannels";
DROP TABLE "StatisticsChannels";
ALTER TABLE "new_StatisticsChannels" RENAME TO "StatisticsChannels";
CREATE UNIQUE INDEX "StatisticsChannels_cid_key" ON "StatisticsChannels"("cid");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
