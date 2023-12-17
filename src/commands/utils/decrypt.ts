import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import crypto from "crypto";

export default {
    data: new SlashCommandBuilder()
        .setName("decrypt")
        .setDescription("Decrypts text.")
        .addStringOption(option => option.setName("text").setDescription("The text.").setRequired(true))
        .addStringOption(option => option.setName("key").setDescription("The key.").setRequired(true))
        .addStringOption(option => option.setName("iv").setDescription("The Initialized Vector.").setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply({ ephemeral: true });
        const text = interaction.options.getString("text") || "";
        let key = interaction.options.getString("key") || "";
        let iv = interaction.options.getString("iv") || "";
        key = crypto.createHash("sha512").update(key).digest("hex").substring(0, 32);
        iv = crypto.createHash("sha512").update(iv).digest("hex").substring(0, 16);
        const algorithm = "aes-256-cbc";
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        const encrypted = Buffer.from(cipher.update(text, "utf8", "hex") + cipher.final("hex")).toString("base64");
        await interaction.followUp(encrypted.toString());
    }
};