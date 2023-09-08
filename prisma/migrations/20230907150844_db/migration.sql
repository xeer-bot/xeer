-- CreateTable
CREATE TABLE "GuildConfiguration" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "welcomemsg" TEXT NOT NULL,
    "leavemsg" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "GuildConfiguration_id_key" ON "GuildConfiguration"("id");
