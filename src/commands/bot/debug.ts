import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { XeerClient } from "../../main.js";

export default {
    data: new SlashCommandBuilder()
        .setName("debug")
        .setDescription("Debugs."),
    async execute(interaction: ChatInputCommandInteraction, bot: XeerClient) {
        await interaction.deferReply();
        throw new Error("Error handler test");
    }
};