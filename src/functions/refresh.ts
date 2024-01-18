import { GuildMember } from "discord.js";
import { bot, prisma } from "../main.js";

export async function refresh() {
    const guilds = await bot.guilds.fetch();
    guilds.forEach((guild: any) => {
        setTimeout(async () => {
            const statisticsChannels = await prisma.statisticsChannels.findMany({
                where: {
                    gid: guild.id,
                },
            });
            if (!statisticsChannels) return;
            statisticsChannels.forEach(async (statisticsChannel) => {
                try {
                    const channel = await bot.channels.fetch(statisticsChannel.cid);
                    if (!channel) {
                        return;
                    }
                    if (channel?.isVoiceBased()) {
                        const guildFetched = await guild.fetch();
                        const guildMembersTotal = await guildFetched.members.fetch();
                        const guildMembers = guildMembersTotal.filter((m: GuildMember) => !m.user.bot);
                        const guildMembersOnline = guildMembers.filter((m: GuildMember) => m.presence?.status == "online" || m.presence?.status == "idle" || m.presence?.status == "dnd");
                        const guildBots = guildMembersTotal.filter((m: GuildMember) => m.user.bot);
                        let content = statisticsChannel.content;
                        content = content.replaceAll("{bots}", guildBots.size.toString());
                        content = content.replaceAll("{members}", guildMembers.size.toString());
                        content = content.replaceAll("{memberstotal}", guildMembersTotal.size.toString());
                        content = content.replaceAll("{membersonline}", guildMembersOnline.size.toString());
                        await channel?.setName(content);
                    }
                } catch (err) {
                    /* empty */
                }
            });
        }, 1000);
    });
    refresh();
}