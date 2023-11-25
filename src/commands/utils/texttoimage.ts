import { ApplicationCommandOptionType, type CommandInteraction } from "discord.js";
import { Discord, Slash, Client, Guard, SlashOption, SlashChoice } from "discordx";
import { createCanvas, loadImage } from "canvas";
import { wrapText, altWrapText } from "../../utils/text_helper.js";

@Discord()
export class TextToImageCommand {
    @Slash({
        name: "texttoimage",
        description: "Puts text on image.",
    })
    async execute(
        @SlashOption({
            name: "text",
            description: "Text that you want to be on the image.",
            required: true,
            type: ApplicationCommandOptionType.String,
        })
        text: string,
        @SlashChoice("1")
        @SlashChoice("2")
        @SlashOption({
            name: "mode",
            description: "Mode.",
            required: true,
            type: ApplicationCommandOptionType.String,
        })
        mode: string,
        interaction: CommandInteraction,
        bot: Client
    ): Promise<void> {
        await interaction.deferReply();
        if (mode == "1") {
            const canvas = makeCanvas(200, 200);
            wrapText(canvas.getContext("2d"), text, 5, 13, 39, 10);
            await interaction.followUp({
                files: [canvas.toBuffer("image/png")],
            });
        } else {
            const canvas = makeCanvas(200, 600);
            altWrapText(canvas.getContext("2d"), text, 5, 13, 39, 10);
            await interaction.followUp({
                files: [canvas.toBuffer("image/png")],
            });
        }
    }
}

function makeCanvas(width: number, height: number) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#000000";
    return canvas;
}
