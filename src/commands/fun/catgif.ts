import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { getTranslated } from "../../languages/helper.js";

export default {
    data: new SlashCommandBuilder()
        .setName("catgif")
        .setDescription("Gives a random cat gif."),
    async execute(interaction: ChatInputCommandInteraction, user: any) {
        await interaction.deferReply();
        await interaction.followUp({
            embeds: [await getTranslated(user.language, "embeds", "cat_gif")],
        });
    }
};