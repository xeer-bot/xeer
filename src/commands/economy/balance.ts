import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { userAccountThing } from "../../utils/database.js";
import { format, getTranslated } from "../../languages/helper.js";

export default {
    data: new SlashCommandBuilder()
        .setName("balance")
        .setDescription("Allows you to see your balance"),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const user = await userAccountThing(interaction.user.id);
        if (!user) throw new Error(await getTranslated("en_us", "messages", "unexpected_err"));
        const embed = await getTranslated(user.language, "embeds", "user_balance");
        await interaction.followUp({
            embeds: [JSON.parse(format(JSON.stringify(embed), interaction.user.id, user.cash))],
        });
    }
};