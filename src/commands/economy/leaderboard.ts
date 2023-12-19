import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { getTranslated, format } from "../../languages/helper.js";
import { prisma } from "../../main.js";
import { userAccountThing } from "../../utils/database.js";

export default {
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("See the Top People!"),
    async execute(interaction: ChatInputCommandInteraction) {
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
                leaderboard += `${i}. <@${users[i].id}>: $${users[i].cash}\\n`;
            }
            interaction.followUp({
                embeds: [JSON.parse(format(JSON.stringify(await getTranslated(user.language, "embeds", "leaderboard")), leaderboard))],
            });
        } else {
            throw new Error(await getTranslated(user.language, "messages", "no_accs_in_db"));
        }
    }
};