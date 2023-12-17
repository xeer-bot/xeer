import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { createCanvas } from "canvas";
import { wrapText, altWrapText } from "../../utils/text_helper.js";

export default {
    data: new SlashCommandBuilder()
        .setName("textoimage")
        .setDescription("Puts text on image.")
        .addStringOption((option: any) =>
            option.setName("mode")
            .setDescription("No description.")
            .addChoices(
                { name: "1", value: "1" },
                { name: "2", value: "2" }
            )
            .setRequired(true)
        ).addStringOption((option: any) => option.setName("text").setDescription("Text.").setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const mode = interaction.options.getString("mode") || "";
        const text = interaction.options.getString("text") || "";
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
    }
};

function makeCanvas(width: number, height: number) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#000000";
    return canvas;
}