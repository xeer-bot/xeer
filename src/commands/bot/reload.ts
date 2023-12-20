import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { format, getTranslated } from "../../languages/helper.js";
import { reload } from "../../components/reload.js";
import { checkDev } from "../../guards/devOnly.js";

export default {
    data: new SlashCommandBuilder()
        .setName("reload")
        .setDescription("Reloads commands.")
        .addStringOption((option) =>
            option
                .setName("category")
                .setDescription("No description.")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("command")
                .setDescription("No description.")
                .setRequired(true)
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        if (!(await checkDev(interaction))) return;
        const cmd = interaction.options.getString("command");
        const category = interaction.options.getString("category");
        if (!cmd || !category) throw new Error(await getTranslated("en_us", "messages", "unexpected_err"));
        const old = new Date();
        const success = reload(category, cmd);
        const new_ = new Date();
        const diff = (new_.getTime() - old.getTime()) / 1000;
        if (success) {
            await interaction.followUp({ embeds: [JSON.parse(format(JSON.stringify(await getTranslated("en_us", "embeds", "success_alt")), diff + "s"))] });
        } else {
            throw new Error((await getTranslated("en_us", "messages", "unexpected_err"), "Check console for more information."));
        }
    }
};
