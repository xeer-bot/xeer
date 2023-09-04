import { CommandInteraction } from "discord.js";
import { Client, Discord, Slash } from "discordx";

@Discord()
export class FeedCommand {
    @Slash({ name: "feed", description: "Give me a snack!" })
    async execute(interaction: CommandInteraction, bot: Client) {
        interaction.reply(":slight_smile:");
    }
}