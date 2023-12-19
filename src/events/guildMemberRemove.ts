import { createGuildConfiguration, guildConfigurationThing } from "../utils/database.js";
import { ChannelType, Events, GuildMember, Message } from "discord.js";
import config from "../../botconfig.json" assert { type: "json" };
import { XeerClient, prisma } from "../main.js";

export default {
    name: Events.GuildMemberRemove,
    once: false,
    async execute(member: GuildMember, bot: XeerClient) {
        const guildConfig = await prisma.guildConfiguration.findUnique({
            where: {
                id: member.guild.id,
            },
        });
        if (guildConfig) {
            if (guildConfig?.leavemsg != "" && guildConfig.leavemsg) {
                const ch = bot.channels.cache.get(guildConfig.leavechannel);
                const now = new Date();
                if (ch?.isTextBased()) {
                    guildConfig.leavemsg = guildConfig.leavemsg.replaceAll("{user}", `${member}`).replaceAll("{timestamp}", now.toISOString()).replaceAll("{guildname}", member.guild.name);
                    try {
                        guildConfig.leavemsg = JSON.parse(guildConfig.leavemsg);
                    } catch (err) {
                        /* empty */
                    }
                    await ch.send(guildConfig.leavemsg);
                }
            }
        } else {
            await createGuildConfiguration(member.guild.id);
        }
    }
}
