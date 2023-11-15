import { prisma } from "../main.js";

export async function createGuildConfiguration(id: string) {
    await prisma.guildConfiguration.create({
        data: {
            id: id,
            welcomemsg: "",
            leavemsg: "",
        },
    });
}

export async function createUserAccount(id: string) {
    await prisma.user.create({
        data: {
            id: id,
            cash: 0,
            language: "en_us"
        },
    });
}

export async function guildConfigurationThing(id: string) {
    const guild = await prisma.guildConfiguration.findUnique({
        where: {
            id: id,
        },
    });
    if (!guild) {
        await createGuildConfiguration(id);
        return await prisma.guildConfiguration.findUnique({
            where: {
                id: id,
            },
        });
    } else {
        return guild;
    }
}

export async function userAccountThing(id: string) {
    const user = await prisma.user.findUnique({
        where: {
            id: id,
        },
    });
    if (!user) {
        await createUserAccount(id);
        return await prisma.user.findUnique({
            where: {
                id: id,
            },
        });
    } else {
        return user;
    }
}
