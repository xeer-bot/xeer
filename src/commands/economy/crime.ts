import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { userAccountThing } from "../../utils/database.js";
import { format, getTranslated } from "../../languages/helper.js";
import { executedRecently, prisma } from "../../main.js";
import { errEmbed } from "../../utils/embeds.js";
import { getRandomArbitrary } from "../../utils/main.js";

export default {
    data: new SlashCommandBuilder()
        .setName("crime")
        .setDescription("Crime."),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        if (!executedRecently.has(interaction.user.id + "-crime")) {
            const messages = ["", "hacked a darkweb website", "nuked TikTok's server", "hacked a Bank", "hacked FBI", "robbed a Gun Shop", "bought and sold Drugs", "robbed Apple Store", "robbed a Bank"];
            const now = new Date();
            const user = await userAccountThing(interaction.user.id);
            if (!user) return;
            const index = getRandomArbitrary(1, messages.length);
            const rCash = getRandomArbitrary(index * 10, index * 25);
            const embed = await getTranslated(user.language, "embeds", "crime_success");
            await interaction.followUp({
                embeds: [JSON.parse(format(JSON.stringify(embed), messages[index], rCash))],
            });
            await prisma.user.update({
                data: {
                    cash: (user.cash || 0) + rCash,
                },
                where: {
                    id: interaction.user.id,
                },
            });
            executedRecently.add(interaction.user.id + "-crime");
            setTimeout(() => {
                executedRecently.delete(interaction.user.id + "-crime");
            }, 1800000);
        } else
            await interaction.followUp({
                embeds: [errEmbed(new Error(), "Try again in `30 minutes`!")],
            });
    }
};