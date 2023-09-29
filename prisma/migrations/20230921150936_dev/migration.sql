-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT '',
    "cash" INTEGER DEFAULT 0
);

-- CreateTable
CREATE TABLE "GuildConfiguration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "welcomemsg" TEXT NOT NULL DEFAULT '',
    "leavemsg" TEXT NOT NULL DEFAULT '',
    "welcomechannel" TEXT NOT NULL DEFAULT '',
    "leavechannel" TEXT NOT NULL DEFAULT '',
    "sendcmd_toggled" TEXT NOT NULL DEFAULT 'allow'
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "GuildConfiguration_id_key" ON "GuildConfiguration"("id");
