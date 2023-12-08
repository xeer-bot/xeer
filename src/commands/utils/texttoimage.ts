import { ApplicationCommandOptionType, type CommandInteraction } from "discord.js";
import { Discord, Slash, Client, SlashOption, SlashChoice } from "discordx";
import { createCanvas } from "canvas";
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
        @SlashChoice({ name: "Manual", value: "3" })
        @SlashOption({
            name: "mode",
            description: "Mode.",
            required: true,
            type: ApplicationCommandOptionType.String,
        })
        mode: string,
        @SlashOption({
            name: "width",
            description: "Resolution Width.",
            required: false,
            type: ApplicationCommandOptionType.Number,
        })
        width: number,
        @SlashOption({
            name: "height",
            description: "Resolution Height.",
            required: false,
            type: ApplicationCommandOptionType.Number,
        })
        height: number,
        @SlashOption({
            name: "starting_x",
            description: "Starting Width.",
            required: false,
            type: ApplicationCommandOptionType.Number,
        })
        starting_x: number,
        @SlashOption({
            name: "starting_y",
            description: "Starting Height.",
            required: false,
            type: ApplicationCommandOptionType.Number,
        })
        starting_y: number,
        @SlashOption({
            name: "max_char",
            description: "Max Characters.",
            required: false,
            type: ApplicationCommandOptionType.Number,
        })
        max_char: number,
        @SlashOption({
            name: "line_height",
            description: "Line Height.",
            required: false,
            type: ApplicationCommandOptionType.Number,
        })
        line_height: number,
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
        }
        if (mode == "2") {
            const canvas = makeCanvas(200, 600);
            altWrapText(canvas.getContext("2d"), text, 5, 13, 39, 10);
            await interaction.followUp({
                files: [canvas.toBuffer("image/png")],
            });
        }
        if (mode == "3") {
            const canvas = makeCanvas(width, height);
            altWrapText(canvas.getContext("2d"), text, starting_x, starting_y, max_char, line_height);
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
