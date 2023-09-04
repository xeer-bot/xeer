import type { CommandInteraction } from "discord.js";
import { Discord, Slash, Client } from "discordx";
import pkg from "../../../package.json" assert { type: "json" };
import { colors } from "../../utils/embeds.ts";

@Discord()
export class InfoCommand {
    @Slash({ name: "info", description: "Info about the bot." })
    async execute(interaction: CommandInteraction, bot: Client): Promise<void> {
        await interaction.deferReply();
        const now = new Date();
        await interaction.followUp({
            content: "",
            embeds: [{
                title: ":bot: Info about the bot.",
                fields: [{
                    name: "Author(s)",
                    value: pkg.author,
                },
                {
                    name: "Version (Date)",
                    value: pkg.version
                },
                {
                    name: "Commands",
                    value: `${bot.application?.commands.cache.size.toString()} commands`
                },
                {
                    name: "Guilds",
                    value: `${bot.guilds.cache.size.toString()} guilds`,
                    inline: true
                }],
                color: colors.primary,
                timestamp: now.toISOString()
            }]
        });
    }
}
