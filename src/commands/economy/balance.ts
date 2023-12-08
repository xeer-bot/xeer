import type { CommandInteraction } from "discord.js";
import { Discord, Slash, Client } from "discordx";
import { userAccountThing } from "../../utils/database.js";
import { getTranslated } from "../../languages/helper.js";
import { format } from "../../languages/helper.js";

@Discord()
export class BalanceCommand {
    @Slash({
        name: "balance",
        description: "Allows you to see your balance",
    })
    async execute(interaction: CommandInteraction, bot: Client): Promise<void> {
        await interaction.deferReply();
        const user = await userAccountThing(interaction.user.id);
        if (!user) return;
        const embed = await getTranslated(user.language, "embeds", "user_balance");
        await interaction.followUp({
            embeds: [JSON.parse(format(JSON.stringify(embed), interaction.user.id, user.cash))],
        });
    }
}
