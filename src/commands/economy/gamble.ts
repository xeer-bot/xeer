import { ApplicationCommandOptionType, type CommandInteraction } from "discord.js";
import { Discord, Slash, Client, SlashOption } from "discordx";
import { executedRecently, prisma } from "../../main.js";
import { colors, errEmbed } from "../../utils/embeds.js";
import { userAccountThing } from "../../utils/database.js";
import { getRandomArbitrary } from "../../utils/main.js";

@Discord()
export class GambleCommand {
    @Slash({
        name: "gamble",
        description: "Just gambling.",
    })
    async execute(
        @SlashOption({
            name: "bet",
            description: "The money that you want to win 2x or lose.",
            required: true,
            type: ApplicationCommandOptionType.Number,
        })
        bet: number,
        interaction: CommandInteraction,
        bot: Client
    ): Promise<void> {
        await interaction.deferReply();
        if (!executedRecently.has(interaction.user.id + "-gamble")) {
            const now = new Date();
            const user = await userAccountThing(interaction.user.id);
            let userCash = user?.cash;
            if (!userCash) userCash = 0;
            if (userCash < bet) {
                await interaction.followUp({
                    embeds: [
                        {
                            title: ":smiling_imp: Gamble",
                            description: `You don't have that much money!`,
                            color: colors.purple,
                            timestamp: now.toISOString(),
                        },
                    ],
                });
                return;
            }
            if (!user) return;
            const random = getRandomArbitrary(1, 4);
            if (random < 2) {
                await interaction.followUp({
                    embeds: [
                        {
                            title: ":smiling_imp: Gamble",
                            description: `You lost all the money you bet!`,
                            color: colors.purple,
                            timestamp: now.toISOString(),
                        },
                    ],
                });
                return;
            }
            const moneyWon = bet * 2;
            await interaction.followUp({
                embeds: [
                    {
                        title: ":smiling_imp: Gamble",
                        description: `You won $${moneyWon}!`,
                        color: colors.purple,
                        timestamp: now.toISOString(),
                    },
                ],
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
}
