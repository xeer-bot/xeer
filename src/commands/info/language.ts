import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { getTranslated } from "../../languages/helper.js";
import { prisma } from "../../main.js";

export default {
    data: new SlashCommandBuilder()
        .setName("language")
        .setDescription("Changes language.")
        .addStringOption((option: any) =>
            option.setName("language")
            .setDescription("Choose your language here.")
            .addChoices(
                { name: "English (US)", value: "en_us" }
            )
            .setRequired(true)
        )
        .addStringOption((option: any) => option.setName("text").setDescription("Text.").setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction, user: any) {
        await interaction.deferReply();
        const selectedLanguage = interaction.options.getString("language") || "";
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
};