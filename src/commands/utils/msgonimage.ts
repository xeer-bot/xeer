import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { createCanvas } from "@napi-rs/canvas";
import { wrapText, altWrapText } from "../../utils/text_helper.js";

export default {
    data: new SlashCommandBuilder()
        .setName("msgonimage")
        .setDescription("Creates a message on image.")
        .addStringOption((option: any) =>
            option
                .setName("nickname")
                .setDescription("The nickname of the user on message.")
                .setRequired(true)
        ).addStringOption((option: any) =>
            option
                .setName("text")
                .setDescription("Text of the message.")
                .setRequired(true)
        ).addStringOption((option: any) =>
            option
                .setName("time")
                .setDescription("Time of the message.")
                .setRequired(true)
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const nickname = interaction.options.getString("nickname") || "";
        const text = interaction.options.getString("text") || "";
        const time = interaction.options.getString("time") || "";
        const canvas = makeCanvas(200, 60);
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#f2f3f5";
        ctx.fillText("kebab", 10, 10);
        /*
            11px - distance from user to text
            8px - distance from user to time
            #dbdee1 - text color
            #f2f3f5 - user color
        */
        // wrapText(canvas.getContext("2d"), text, 5, 13, 39, 10);
        await interaction.followUp({
            files: [canvas.toBuffer("image/png")],
        });
    }
};

function makeCanvas(width: number, height: number) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#38343c";
    ctx.fillRect(0, 0, width, height);
    return canvas;
}