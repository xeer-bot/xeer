import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("peppino")
        .setDescription("Yeah..."),
    async execute(interaction: ChatInputCommandInteraction) {
        interaction.reply("https://cdn.discordapp.com/attachments/1140330918876299339/1151506124978274415/c65dc2d81aa671f550ad2c5cb6121d98.png");
    }
};