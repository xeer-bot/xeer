import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("base64decode")
        .setDescription("Decodes text.")
        .addStringOption(option => option.setName("text").setDescription("The text.").setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply({ ephemeral: true });
        const text = interaction.options.getString("text") || "";
        await interaction.followUp({ content: "```" + Buffer.from(text, "base64").toString() + "```" });
    }
};