import type { CommandInteraction } from "discord.js";
import { Discord, Slash, Client } from "discordx";
import { colors, errEmbed } from "../../utils/embeds.js";
import { prisma } from "../../main.js";
import { getTranslated, format } from "../../languages/helper.js";
import { userAccountThing } from "../../utils/database.js";

@Discord()
export class LeaderboardCommand {
    @Slash({
        name: "leaderboard",
        description: "See the Top People!",
    })
    async execute(interaction: CommandInteraction, bot: Client): Promise<void> {
        await interaction.deferReply();
        const now = new Date();
        const user = await userAccountThing(interaction.user.id);
        if (!user) return;
        const users = await prisma.user.findMany({
            orderBy: {
                cash: "desc",
            },
            take: 10,
        });
        if (users) {
            let leaderboard = "";
            for (let i = 0; i < users.length; i++) {
                leaderboard += `${i}. <@${users[i].id}>: $${users[i].cash}\n`;
            }
            interaction.followUp({
                embeds: [JSON.parse(format(JSON.stringify(await getTranslated(user.language, "embeds", "leaderboard")), leaderboard))],
            });
        } else {
            interaction.followUp({
                embeds: [errEmbed(new Error(), "No accounts found in the database!")],
            });
        }
    }
}
