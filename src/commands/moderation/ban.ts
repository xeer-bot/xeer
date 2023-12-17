import { ChatInputCommandInteraction, GuildMember, GuildMemberRoleManager, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { format, getTranslated } from "../../languages/helper.js";
import { bot } from "../../main.js";
import { userAccountThing } from "../../utils/database.js";
import { noBotPermsEmbedBUK, npEmbed } from "../../utils/embeds.js";

export default {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("A banhammer.")
        .addUserOption(option => option.setName("member").setDescription("Member that you want to ban.").setRequired(true))
        .addStringOption(option => option.setName("reason").setDescription("No description.").setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const user = await userAccountThing(interaction.user.id);
        if (!user) return;
        const member = (interaction.options.getMember("member") as GuildMember);
        const reason = interaction.options.getString("reason");
        if (!member) {
            throw new Error(await getTranslated(user.language, "messages", "unexpected_err"));
        }
        if (interaction.memberPermissions?.has("BanMembers") && (interaction.member?.roles as GuildMemberRoleManager).highest.position > member.roles.highest.position) {
            (await bot.users.fetch(member.id))
                .send({
                    embeds: [JSON.parse(format(JSON.stringify(await getTranslated(user.language, "embeds", "got_banned")), interaction.guild?.name, reason))],
                })
                .catch(async () => {
                    interaction.channel?.send(await getTranslated(user.language, "messages", "dm_noperms"));
                });
            interaction.guild?.members
                .ban(member)
                .then(async (res) => {
                    await interaction.followUp({
                        embeds: [JSON.parse(format(JSON.stringify(await getTranslated(user.language, "embeds", "user_banned")), member, reason))],
                    });
                })
                .catch(async () => {
                    const e = noBotPermsEmbedBUK("Ban Members");
                    await interaction.followUp({
                        embeds: [e],
                    });
                });
        } else {
            const e = npEmbed(undefined, "Ban Members");
            await interaction.followUp({
                embeds: [e],
            });
        }
    }
};