import { Discord, ArgsOf, On, Client } from "discordx";
import { prisma } from "../main.js";
import { createGuildConfiguration } from "../utils/database.js";

@Discord()
export class GuildMemberAdd {
    @On({
        event: "guildMemberAdd",
    })
    async guildMemberAdd([member]: ArgsOf<"guildMemberAdd">, bot: Client, guardPayload: any) {
        // guildconfig
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
