import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { userAccountThing } from "../../utils/database.js";
import { getTranslated } from "../../languages/helper.js";

export default {
    data: new SlashCommandBuilder()
        .setName("catgif")
        .setDescription("Gives a random cat gif."),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const now = new Date();
        const user = await userAccountThing(interaction.user.id);
        if (!user) return;
        await interaction.followUp({
            embeds: [await getTranslated(user.language, "embeds", "cat_gif")],
        });
    }
};