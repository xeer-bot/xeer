import { CommandInteraction, ApplicationCommandOptionType } from "discord.js";
import { Discord, Slash, Client, SlashOption } from "discordx";

@Discord()
export class Base64Decode {
    @Slash({
        name: "base64decode",
        description: "Decodes Base64 to text.",
    })
    async execute(
        @SlashOption({
            name: "text",
            description: "Base64 string... Mhm...",
            required: true,
            type: ApplicationCommandOptionType.String,
        })
        text: string,
        interaction: CommandInteraction,
        bot: Client
    ): Promise<void> {
        await interaction.deferReply();
        await interaction.followUp({ content: "```" + Buffer.from(text, "base64").toString() + "```", ephemeral: true });
    }
}
