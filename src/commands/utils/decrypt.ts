import { CommandInteraction, ApplicationCommandOptionType } from "discord.js";
import { Discord, Slash, Client, SlashOption } from "discordx";
import crypto from "crypto";

@Discord()
export class Decrypt {
    @Slash({
        name: "decrypt",
        description: "Decrypts text using Crypto.",
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
        const buff = Buffer.from(text, "base64");
        key = crypto.createHash("sha512").update(key).digest("hex").substring(0, 32);
        iv = crypto.createHash("sha512").update(iv).digest("hex").substring(0, 16);
        const algorithm = "aes-256-cbc";
        const decipheriv = crypto.createDecipheriv(algorithm, key, iv);
        const decrypted = decipheriv.update(buff.toString("utf8"), "hex", "utf8") + decipheriv.final("utf8");
        await interaction.followUp(decrypted);
    }
}
