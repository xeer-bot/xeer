import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { XeerClient } from "../../main.js";
import { checkDev } from "../../guards/devOnly.js";

export default {
    data: new SlashCommandBuilder()
        .setName("eval")
        .setDescription("Evals some code.")
        .addStringOption(option => option.setName("code").setDescription("No description.").setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction, bot: XeerClient) {
        await interaction.deferReply({ ephemeral: true });
        if (!(await checkDev(interaction))) return;
        const code = interaction.options.getString("code") || "";
        const result = await eval(code);
        let resultReplaced = "No output.";
        if (typeof result == "string") {
            resultReplaced = result.replace(bot.token ?? "😧", "no.");
        }
        interaction.followUp(resultReplaced);
    }
};