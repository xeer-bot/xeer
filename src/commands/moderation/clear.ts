import { ChannelType, ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { format, getTranslated } from "../../languages/helper.js";
import { userAccountThing } from "../../utils/database.js";

export default {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Clears messages.")
        .addNumberOption(option => option.setName("amount").setDescription("No description.").setMaxValue(100).setMinValue(0).setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const user = await userAccountThing(interaction.user.id);
        if (!user) return;
        if (interaction.channel?.type == ChannelType.DM) throw new Error("Channel's type is `DM`");
        const amount = interaction.options.getNumber("amount") || 0;
        if (amount > 100) throw new Error(await getTranslated(user.language, "messages", "max_amount_err"));
        if (amount < 0) throw new Error(await getTranslated(user.language, "messages", "min_amount_err"));
        if (!interaction.memberPermissions?.has("ManageMessages")) throw new Error(await getTranslated(user.language, "messages", "no_permission2"));
        await interaction.followUp(await getTranslated(user.language, "messages", "deleting_msgs"));
        await interaction.channel?.bulkDelete(amount, true);
        await interaction.channel?.send({
            embeds: [JSON.parse(format(JSON.stringify(await getTranslated(user.language, "embeds", "deleted_msgs")), amount, interaction.user.username))],
        });
    }
};