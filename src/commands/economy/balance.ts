import type { CommandInteraction } from "discord.js";
import { Discord, Slash, Client } from "discordx";
import { colors, errEmbed } from "../../utils/embeds.js";
import { prisma } from "../../main.js";
import { userAccountThing } from "../../utils/database.js";

@Discord()
export class BalanceCommand {
    @Slash({
        name: "balance",
        description: "Allows you to see your balance",
    })
    async execute(interaction: CommandInteraction, bot: Client): Promise<void> {
        await interaction.deferReply();
        const now = new Date();
        const client = prisma;
        const user = await userAccountThing(interaction.user.id);
        if (!user) return;
        interaction.followUp({
            embeds: [
                {
                    title: ":money_with_wings: Balance",
                    description: `<@${interaction.user.id}>'s Balance: $${user.cash}`,
                    color: colors.green,
                    timestamp: now.toISOString(),
                },
            ],
        });
    }
}
