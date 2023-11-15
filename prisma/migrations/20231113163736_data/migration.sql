-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT '',
    "cash" INTEGER DEFAULT 0,
    "language" TEXT NOT NULL DEFAULT 'en_us'
);
INSERT INTO "new_User" ("cash", "id") SELECT "cash", "id" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
