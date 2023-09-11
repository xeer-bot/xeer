import { prisma } from "../main.ts";

export async function createGuildConfiguration(id: string) {
    await prisma.guildConfiguration.create({ data: {
        id: id,
        welcomemsg: "",
        leavemsg: ""
    } });
}

export async function guildConfigurationCheck(id: string) {
    if (await prisma.guildConfiguration.findUnique({ where: { id: id } })) { return true; } else return false;
}