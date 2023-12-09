import { Response } from "express";
import { prisma } from "../../main.js";

export async function save(guild_id: string, data: any, res: Response) {
    const method = data.method;
    switch (method) {
        case "add":
            await prisma.statisticsChannels.create({
                data: {
                    cid: data.channel,
                    gid: guild_id,
                    content: data.content,
                },
            });
            return res.json({ message: "Saved." });
        case "modify":
            await prisma.statisticsChannels.update({
                where: {
                    cid: data.channel,
                    gid: guild_id
                },
                data: {
                    content: data.content,
                }
            });
            return res.json({ message: "Saved." });
        case "remove":
            await prisma.statisticsChannels.delete({
                where: {
                    cid: data.channel,
                    gid: guild_id,
                }
            });
            return res.json({ message: "Removed." });
        default:
            return res.status(400).json({ message: "That method doesn't exist!" });
    }
}