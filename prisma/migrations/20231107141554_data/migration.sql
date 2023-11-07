-- CreateTable
CREATE TABLE "StatisticsChannels" (
    "cid" TEXT NOT NULL PRIMARY KEY,
    "gid" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT ''
);

-- CreateIndex
CREATE UNIQUE INDEX "StatisticsChannels_cid_key" ON "StatisticsChannels"("cid");

-- CreateIndex
CREATE UNIQUE INDEX "StatisticsChannels_gid_key" ON "StatisticsChannels"("gid");
