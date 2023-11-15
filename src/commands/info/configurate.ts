import { ApplicationCommandOptionType, type CommandInteraction } from "discord.js";
import { Discord, Slash, Client, SlashChoice, SlashOption } from "discordx";
import { colors, emojis, errEmbed, npEmbed } from "../../utils/embeds.js";
import { prisma } from "../../main.js";
import { createGuildConfiguration, guildConfigurationThing, userAccountThing } from "../../utils/database.js";
import { getTranslated } from "../../languages/helper.js";

@Discord()
export class ConfigurateCommand {
    @Slash({
        name: "configurate",
        description: "Configure the Welcome/Leave Messages and their Channel's IDs",
    })
    async execute(
        @SlashChoice({
            name: "Welcome Message",
            value: "welcomemsg",
        })
        @SlashChoice({
            name: "Leave Message",
            value: "leavemsg",
        })
        @SlashChoice({
            name: "Welcome Message Channel ID",
            value: "welcomechannel",
        })
        @SlashChoice({
            name: "Leave Message Channel ID",
            value: "leavechannel",
        })
        @SlashChoice({
            name: "Send Command (ALLOW or DISALLOW)",
            value: "sendcmd_toggled",
        })
        @SlashOption({
            name: "option",
            description: "Configuration Option",
            required: true,
            type: ApplicationCommandOptionType.String,
        })
        option: string,
        @SlashOption({
            name: "text",
            description: "Text (Placeholders: {user}, {guildname}, {timestamp})",
            required: true,
            type: ApplicationCommandOptionType.String,
        })
        text: string,
        interaction: CommandInteraction,
        bot: Client
    ): Promise<void> {
        await interaction.deferReply();
        const gID = interaction.guild?.id || "";
        if (interaction.memberPermissions?.has("Administrator")) {
            await guildConfigurationThing(interaction.guild?.id || "");
            const data: any = {};
            if (option.endsWith("_toggled")) {
                text = text.toLowerCase();
                if (text != "allow" && text != "disallow") {
                    await interaction.followUp({
                        embeds: [errEmbed(new Error(), "Wrong text, I only accept `ALLOW` or `DISALLOW`.")],
                    });
                    return;
                }
            }
            data[option] = text;
            await prisma.guildConfiguration.update({
                where: {
                    id: gID,
                },
                data: data,
            });
            const now = new Date();
            const user = await userAccountThing(interaction.user.id);
            if (!user) return;
            await interaction.followUp({
                embeds: [await getTranslated(user.language, "embeds", "success")],
            });
        } else {
            await interaction.followUp({
                embeds: [npEmbed(undefined, "Administrator")],
            });
        }
    }
}
