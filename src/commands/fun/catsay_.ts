import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { userAccountThing } from "../../utils/database.js";
import { format, getTranslated } from "../../languages/helper.js";

export default {
    data: new SlashCommandBuilder()
        .setName("catsay")
        .setDescription("A cat says something that you want.")
        .addStringOption(option => option.setName("text").setDescription("Text that you want the cat to say.").setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const text = interaction.options.getString("name") || "";
        const now = new Date();
        const user = await userAccountThing(interaction.user.id);
        if (!user) return;
        await interaction.followUp({
            embeds: [JSON.parse(format(JSON.stringify(await getTranslated(user.language, "embeds", "cat_say")), text, encodeURIComponent(text)))],
        });
    }
};