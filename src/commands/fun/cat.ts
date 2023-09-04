import { CommandInteraction } from "discord.js";
import { Discord, Slash, Client } from "discordx";
import { colors } from "../../utils/embeds.ts";

@Discord()
export class CatSayCommand {
    @Slash({ name: "cat", description: "Random cat." })
    async execute(interaction: CommandInteraction, bot: Client): Promise<void> {
        await interaction.deferReply();
        const now = new Date();
        await interaction.followUp({
            embeds: [{
                title: ":cat: Random cat.",
                description: `Random cat.`,
                image: {
                    url: `https://cataas.com/cat`
                },
                color: colors.yellow,
                timestamp: now.toISOString()
            }]
        })
    }
}
