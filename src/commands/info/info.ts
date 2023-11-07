import type { CommandInteraction } from "discord.js";
import { Discord, Slash, Client } from "discordx";
import botconfig from "../../../botconfig.json" assert { type: "json" };
import pkg from "../../../package.json" assert { type: "json" };
import { colors } from "../../utils/embeds.js";

@Discord()
export class InfoCommand {
    @Slash({
        name: "info",
        description: "Info about the bot.",
    })
    async execute(interaction: CommandInteraction, bot: Client): Promise<void> {
        await interaction.deferReply();
        const now = new Date();
        let botowner = bot.users.cache.get(botconfig.ownerID)?.username;
        let description = `This instance is managed by ${botowner}.`;
        if (botconfig.ownerID == "1168788770510868553") {
            description = "This instance is an **official instance**.";
        }
        await interaction.followUp({
            embeds: [
                {
                    author: {
                        name: "Info about the bot.",
                        icon_url: bot.user?.avatarURL() || "https://ireland.apollo.olxcdn.com/v1/files/eyJmbiI6IjJsMDMyamp6dmw2Mi1PVE9NT1RPUEwifQ.xMAd58iLO7mmXPgYdkyyY63wN_Rwhbpsu6aNkqFaLZk/image",
                    },
                    description: description,
                    fields: [
                        {
                            name: "Statistics:",
                            value: `
                            Commands: ${bot.application?.commands.cache.size.toString()}
                            Guild(s): ${bot.guilds.cache.size.toString()}
                            `,
                        }
                    ],
                    color: 0xffffff,
                    timestamp: now.toISOString(),
                },
            ],
        });
    }
}
