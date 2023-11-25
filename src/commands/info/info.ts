import type { CommandInteraction } from "discord.js";
import { Discord, Slash, Client } from "discordx";
import botconfig from "../../../botconfig.json" assert { type: "json" };
import pkg from "../../../package.json" assert { type: "json" };
import { colors } from "../../utils/embeds.js";
import * as fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { userAccountThing } from "../../utils/database.js";
import { format, getTranslated } from "../../languages/helper.js";

@Discord()
export class InfoCommand {
    @Slash({
        name: "info",
        description: "Info about the bot.",
    })
    async execute(interaction: CommandInteraction, bot: Client): Promise<void> {
        await interaction.deferReply();
        const now = new Date();
        const user = await userAccountThing(interaction.user.id);
        if (!user) return;
        const translated = await getTranslated(user.language, "custom", "info");
        let botowner = bot.users.cache.get(botconfig.ownerID)?.username;
        if (!botowner) {
            botowner = "Unknown.";
        }
        let description = JSON.parse(format(JSON.stringify(translated["managed_by"]), botowner));
        if (botconfig.ownerID == "1168788770510868553") {
            description = translated["official_instance"];
        }
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        const x = fs.readFileSync(__dirname + "/../../../build_date.txt").toString();
        let build_date = new Date(x).toLocaleString("en-US", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", hour12: true, minute: "2-digit", second: "2-digit" });
        await interaction.followUp({
            embeds: [
                {
                    author: {
                        name: translated.title,
                        icon_url: bot.user?.avatarURL() || "https://ireland.apollo.olxcdn.com/v1/files/eyJmbiI6IjJsMDMyamp6dmw2Mi1PVE9NT1RPUEwifQ.xMAd58iLO7mmXPgYdkyyY63wN_Rwhbpsu6aNkqFaLZk/image",
                    },
                    description: `${description}\n${translated["build_date"]}: ${build_date}`,
                    fields: [
                        {
                            name: translated["stats_field"],
                            value: `
                            > ${translated["commands"]}: **${bot.application?.commands.cache.size.toString()}**
                            > ${translated["guilds"]}: **${bot.guilds.cache.size.toString()}**
                            `,
                        },
                        {
                            name: "Translation",
                            value: `> Translated by: **${translated["translated_by"]}**`,
                        },
                    ],
                    color: 0xffffff,
                    timestamp: now.toISOString(),
                },
            ],
        });
    }
}
