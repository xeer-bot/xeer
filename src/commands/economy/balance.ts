import type { CommandInteraction } from "discord.js";
import { Discord, Slash, Client } from "discordx";
import { colors, errEmbed } from "../../utils/embeds.js";
import { prisma } from "../../main.js";

@Discord()
export class BalanceCommand {
    @Slash({ name: "balance", description: "Economy : Balance" })
    async execute(interaction: CommandInteraction, bot: Client): Promise<void> {
        await interaction.deferReply();
        const now = new Date();
        const client = prisma;
        const user = await client.user.findFirst({ where: {
            id: interaction.user.id
        } });
        if (user) {
            interaction.followUp({
                embeds: [{
                    title: ":money_with_wings: Balance",
                    description: `<@${interaction.user.id}>'s Balance: $${user.cash}`,
                    color: colors.green,
                    timestamp: now.toISOString()
                }]
            });
        } else {
            interaction.followUp({ embeds: [ errEmbed(new Error(), "No account found in the database!\nTry again!") ] });
            await client.user.create({ data: {
                id: interaction.user.id,
                cash: 0
            } });
        }
    }
}
