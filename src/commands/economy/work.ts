import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { getTranslated, format } from "../../languages/helper.js";
import { executedRecently, prisma } from "../../main.js";
import { userAccountThing } from "../../utils/database.js";
import { errEmbed } from "../../utils/embeds.js";
import { getRandomArbitrary } from "../../utils/main.js";

export default {
    data: new SlashCommandBuilder()
        .setName("work")
        .setDescription("Work!"),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        if (!executedRecently.has(interaction.user.id)) {
            const messages = ["", "did your chores", "walked someone's dog", "washed a car", "worked in an office", "worked in a zoo", "developed a game", "built a house"];
            const now = new Date();
            const user = await userAccountThing(interaction.user.id);
            if (!user) return;
            const index = getRandomArbitrary(1, messages.length);
            const rCash = getRandomArbitrary(index * 2, index * 5);
            await interaction.followUp({
                embeds: [JSON.parse(format(JSON.stringify(await getTranslated(user.language, "embeds", "work")), messages[index], rCash))],
            });
            await prisma.user.update({
                data: {
                    cash: (user.cash || 0) + rCash,
                },
                where: {
                    id: interaction.user.id,
                },
            });
            executedRecently.add(interaction.user.id);
            setTimeout(() => {
                executedRecently.delete(interaction.user.id);
            }, 30000);
        } else
            await interaction.followUp({
                embeds: [errEmbed(new Error(), "Try again in `30 seconds`!")],
            });
    }
};