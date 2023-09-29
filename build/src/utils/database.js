import { prisma } from "../main.js";
export async function createGuildConfiguration(id) {
    await prisma.guildConfiguration.create({ data: {
            id: id,
            welcomemsg: "",
            leavemsg: ""
        } });
}
export async function guildConfigurationCheck(id) {
    if (await prisma.guildConfiguration.findUnique({ where: { id: id } })) {
        return true;
    }
    else
        return false;
}
