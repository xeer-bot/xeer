import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { userAccountThing } from "../../utils/database.js";
import { format, getTranslated } from "../../languages/helper.js";
import { executedRecently, prisma } from "../../main.js";
import { errEmbed } from "../../utils/embeds.js";
import { getRandomArbitrary } from "../../utils/main.js";

export default {
    data: new SlashCommandBuilder()
        .setName("catsay")
        .setDescription("A cat says something that you want.")
        .addNumberOption(option => option.setName("bet").setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const bet = interaction.options.getNumber("bet") || 0;
        if (!executedRecently.has(interaction.user.id + "-gamble")) {
            const now = new Date();
            const user = await userAccountThing(interaction.user.id);
            if (!user) return;
            let userCash = user?.cash;
            if (!userCash) userCash = 0;
            if (userCash < bet) {
                await interaction.followUp({
                    embeds: [await getTranslated(user.language, "embeds", "gamble_no_money")],
                });
                return;
            }
            const random = getRandomArbitrary(1, 2);
            if (random == 2) {
                await interaction.followUp({
                    embeds: [await getTranslated(user.language, "embeds", "gamble_lost")],
                });
                return;
            }
            const moneyWon = bet * 2;
            await interaction.followUp({
                embeds: [JSON.parse(format(JSON.stringify(await getTranslated(user.language, "embeds", "gamble_won")), moneyWon))],
            });
            await prisma.user.update({
                data: {
                    cash: (user.cash || 0) + moneyWon,
                },
                where: {
                    id: interaction.user.id,
                },
            });
            executedRecently.add(interaction.user.id + "-gamble");
            setTimeout(() => {
                executedRecently.delete(interaction.user.id + "-gamble");
            }, 216000000);
        } else
            await interaction.followUp({
                embeds: [errEmbed(new Error(), "Try again in `1 hour`!")],
            });
    }
};