import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { format, getTranslated } from "../../languages/helper.js";
import { userAccountThing } from "../../utils/database.js";

export default {
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Unbans a banned member.")
        .addStringOption(option => option.setName("user_id").setDescription("No description.").setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const member = interaction.options.getUser("user_id");
        if (!member) throw new Error("Member is undefined.");
        const user = await userAccountThing(interaction.user.id);
        if (!user) return;
        if (!interaction.memberPermissions?.has("BanMembers")) throw new Error(await getTranslated(user.language, "messages", "no_permission2"));
        interaction.guild?.members
            .unban(member)
            .then(async (res) => {
                await interaction.followUp({
                    embeds: [JSON.parse(format(JSON.stringify(await getTranslated(user.language, "embeds", "user_unbanned")), member))],
                });
            })
            .catch(async (res) => {
                throw new Error(await getTranslated(user.language, "messages", "dm_noperms"));
            });
    }
};