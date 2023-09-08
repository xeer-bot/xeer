import { prisma } from "../main.ts";

export async function createGuildConfiguration(id: string) {
    await prisma.guildConfiguration.create({ data: {
        id: id,
        welcomemsg: "",
        leavemsg: ""
    } });
}