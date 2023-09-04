import { CommandInteraction } from "discord.js";
import { Discord, Slash, Client } from "discordx";
import { colors } from "../../utils/embeds.ts";

@Discord()
export class CatSayCommand {
    @Slash({ name: "catgif", description: "Random cat gif." })
    async execute(interaction: CommandInteraction, bot: Client): Promise<void> {
        await interaction.deferReply();
        const now = new Date();
        await interaction.followUp({
            embeds: [{
                title: ":cat: Random cat.",
                description: `Random cat gif.`,
                image: {
                    url: `https://cataas.com/cat/gif`
                },
                color: colors.yellow,
                timestamp: now.toISOString()
            }]
        })
    }
}
