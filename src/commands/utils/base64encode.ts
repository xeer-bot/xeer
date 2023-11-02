import { CommandInteraction, ApplicationCommandOptionType } from "discord.js";
import { Discord, Slash, Client, SlashOption } from "discordx";

@Discord()
export class Base64Encode {
    @Slash({
        name: "base64encode",
        description: "Encodes text to Base64.",
    })
    async execute(
        @SlashOption({
            name: "text",
            description: "A plain string... Mhm...",
            required: true,
            type: ApplicationCommandOptionType.String,
        })
        text: string,
        interaction: CommandInteraction,
        bot: Client
    ): Promise<void> {
        await interaction.deferReply();
        await interaction.followUp({ content: "```" + Buffer.from(text).toString("base64") + "```", ephemeral: true });
    }
}
