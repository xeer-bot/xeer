import { Response } from "express";
import { prisma } from "../../main.js";

export async function save(guild_id: string, data: any, res: Response) {
    await prisma.guildConfiguration.update({
        where: {
            id: guild_id,
        },
        data: {
            welcomemsg: data.welcome_message,
            welcomechannel: data.welcome_channel,
            leavemsg: data.leave_message,
            leavechannel: data.leave_channel,
        },
    });
    res.json({ message: "Saved." });
}
