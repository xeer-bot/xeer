import type { CommandInteraction } from "discord.js";
import { Discord, Slash, Client } from "discordx";
import { executedRecently, prisma } from "../../main.js";
import { errEmbed } from "../../utils/embeds.js";
import { userAccountThing } from "../../utils/database.js";
import { getRandomArbitrary } from "../../utils/main.js";
import { getTranslated, format } from "../../languages/helper.js";

@Discord()
export class WorkCommand {
    @Slash({
        name: "work",
        description: "Work!",
    })
    async execute(interaction: CommandInteraction, bot: Client): Promise<void> {
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
}
