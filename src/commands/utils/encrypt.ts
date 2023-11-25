import { CommandInteraction, ApplicationCommandOptionType } from "discord.js";
import { Discord, Slash, Client, SlashOption } from "discordx";
import crypto from "crypto";

@Discord()
export class Encrypt {
    @Slash({
        name: "encrypt",
        description: "Encrypts text using Crypto.",
    })
    async execute(
        @SlashOption({
            name: "text",
            description: "A plain string... Mhm...",
            required: true,
            type: ApplicationCommandOptionType.String,
        })
        text: string,
        @SlashOption({
            name: "key",
            description: "Key to decrypt.",
            required: true,
            type: ApplicationCommandOptionType.String,
        })
        key: string,
        @SlashOption({
            name: "iv",
            description: "Initialized Vector.",
            required: true,
            type: ApplicationCommandOptionType.String,
        })
        iv: string,
        interaction: CommandInteraction,
        bot: Client
    ): Promise<void> {
        await interaction.deferReply({ ephemeral: true });
        key = crypto.createHash("sha512").update(key).digest("hex").substring(0, 32);
        iv = crypto.createHash("sha512").update(iv).digest("hex").substring(0, 16);
        const algorithm = "aes-256-cbc";
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        const encrypted = Buffer.from(cipher.update(text, "utf8", "hex") + cipher.final("hex")).toString("base64");
        await interaction.followUp(encrypted.toString());
    }
}
