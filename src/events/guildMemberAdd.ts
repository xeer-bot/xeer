import { createGuildConfiguration, guildConfigurationThing } from "../utils/database.js";
import { ChannelType, Events, GuildMember, Message } from "discord.js";
import config from "../../botconfig.json" assert { type: "json" };
import { XeerClient, prisma } from "../main.js";

export default {
    name: Events.GuildMemberAdd,
    once: false,
    async execute(member: GuildMember, bot: XeerClient) {
        const guildConfig = await prisma.guildConfiguration.findUnique({
            where: {
                id: member.guild.id,
            },
        });
        if (guildConfig) {
            if (guildConfig?.welcomemsg != "" && guildConfig.welcomemsg) {
                const ch = bot.channels.cache.get(guildConfig.welcomechannel);
                const now = new Date();
                if (ch?.isTextBased()) {
                    guildConfig.welcomemsg = guildConfig.welcomemsg.replaceAll("{user}", `${member}`).replaceAll("{timestamp}", now.toISOString()).replaceAll("{guildname}", member.guild.name);
                    try {
                        guildConfig.welcomemsg = JSON.parse(guildConfig.welcomemsg);
                    } catch (err) {
                        /* empty */
                    }
                    await ch.send(guildConfig.welcomemsg);
                }
            }
        } else {
            await createGuildConfiguration(member.guild.id);
        }
    }
}
