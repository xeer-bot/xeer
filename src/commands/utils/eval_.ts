import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { errEmbed } from "../../utils/embeds.js";
import { XeerClient } from "../../main.js";

export default {
    data: new SlashCommandBuilder()
        .setName("eval")
        .setDescription("Evals some code.")
        .addStringOption(option => option.setName("code").setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction, bot: XeerClient) {
        await interaction.deferReply({ ephemeral: true });
        try {
            const code = interaction.options.getString("code") || "";
            const result = await eval(code);
            let resultReplaced = "No output.";
            if (typeof result == "string") {
                resultReplaced = result.replace(bot.token ?? "😧", "no.");
            }
            interaction.followUp(resultReplaced);
        } catch (err) {
            if (err instanceof Error) {
                await interaction.followUp({ embeds: [errEmbed(err, undefined)] });
            } else {
                await interaction.followUp({ embeds: [errEmbed(new Error("An unexpected error occured!"), undefined)] });
            }
        }
    }
};