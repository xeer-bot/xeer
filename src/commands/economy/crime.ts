import type { CommandInteraction } from "discord.js";
import { Discord, Slash, Client, Guard } from "discordx";
import { executedRecently, prisma } from "../../main.js";
import { colors, errEmbed } from "../../utils/embeds.js";
import { userAccountThing } from "../../utils/database.js";
import { getRandomArbitrary } from "../../utils/main.js";
import { getTranslated, format } from "../../languages/helper.js";

@Discord()
export class CrimeCommand {
    @Slash({
        name: "crime",
        description: "Economy : Crime",
    })
    async execute(interaction: CommandInteraction, bot: Client): Promise<void> {
        await interaction.deferReply();
        if (!executedRecently.has(interaction.user.id + "-crime")) {
            const messages = ["", "hacked a darkweb website", "nuked TikTok's server", "hacked a Bank", "hacked FBI", "robbed a Gun Shop", "bought and sold Drugs", "robbed Apple Store", "robbed a Bank"];
            const now = new Date();
            const user = await userAccountThing(interaction.user.id);
            if (!user) return;
            let index = getRandomArbitrary(1, messages.length);
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
}
