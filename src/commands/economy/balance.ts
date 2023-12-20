import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { format, getTranslated } from "../../languages/helper.js";

export default {
    data: new SlashCommandBuilder()
        .setName("balance")
        .setDescription("Allows you to see your balance"),
    async execute(interaction: ChatInputCommandInteraction, user: any) {
        await interaction.deferReply();
        const embed = await getTranslated(user.language, "embeds", "user_balance");
        await interaction.followUp({
            embeds: [JSON.parse(format(JSON.stringify(embed), interaction.user.id, user.cash))],
        });
    }
};