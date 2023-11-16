import { ApplicationCommandOptionType, type CommandInteraction } from "discord.js";
import { Discord, Slash, Client, Guard, SlashOption } from "discordx";
import { createCanvas, loadImage } from 'canvas';
import { wrapText } from "../../utils/text_helper.js";
import { wrap } from "module";

@Discord()
export class TextifyCommand {
    @Slash({
        name: "textify",
        description: "Textifies. :)",
    })
    async execute(
        @SlashOption({
            name: "text",
            description: "Text that you want to TEXTIFY.",
            required: false,
            type: ApplicationCommandOptionType.String,
        })
        text: string,
        interaction: CommandInteraction,
        bot: Client
    ): Promise<void> {
        const width = 200;
        const height = 200;
        await interaction.deferReply();
        const canvas = createCanvas(200, 200);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "#000000";
        wrapText(ctx, text, 5, 13, 39, 10);
        await interaction.followUp({
            files: [canvas.toBuffer("image/png")]
        })
    }
}
