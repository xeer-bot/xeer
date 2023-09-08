import { Discord, ArgsOf, On, Client } from "discordx";
import { prisma } from "../main.ts";
import { createGuildConfiguration } from "../utils/database.ts";

@Discord()
export class GuildMemberAdd {
    @On({ event: "guildMemberAdd" })
    async guildMemberAdd(
        [member]: ArgsOf<"guildMemberAdd">,
        bot: Client,
        guardPayload: any
    ) {
        const guildConfig = await prisma.guildConfiguration.findUnique({ where: { id: member.guild.id } });
        if (guildConfig) {
            if (guildConfig?.welcomemsg != "" && guildConfig.welcomemsg) {
                const ch = bot.channels.cache.get(guildConfig.welcomechannel);
                if (ch?.isTextBased()) {
                    ch.send(guildConfig.welcomemsg.replaceAll("{user}", `${member}`));
                }
            }
        } else {
            await createGuildConfiguration(member.guild.id);
        }
    }
}