import { ApplicationCommandOptionType, type CommandInteraction } from "discord.js";
import { Discord, Slash, Client, SlashChoice, SlashOption } from "discordx";
import { colors, emojis, errEmbed, npEmbed } from "../../utils/embeds.js";
import { prisma } from "../../main.js";
import { createGuildConfiguration, guildConfigurationThing, userAccountThing } from "../../utils/database.js";
import { getTranslated } from "../../languages/helper.js";

@Discord()
export class LanguageCommand {
    @Slash({
        name: "language",
        description: "Changes language.",
    })
    async execute(
        @SlashChoice({
            name: "English (US)",
            value: "en_us",
        })
        @SlashOption({
            name: "language",
            description: "Language.",
            required: true,
            type: ApplicationCommandOptionType.String,
        })
        selectedLanguage: string,
        interaction: CommandInteraction,
        bot: Client
    ): Promise<void> {
        await interaction.deferReply();
        const now = new Date();
        const user = await userAccountThing(interaction.user.id);
        if (!user) return;
        await prisma.user.update({
            where: {
                id: interaction.user.id,
            },
            data: {
                language: selectedLanguage,
            },
        });
        await interaction.followUp({
            embeds: [await getTranslated(user.language, "embeds", "success")],
        });
    }
}
