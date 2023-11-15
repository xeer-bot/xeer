import { CommandInteraction, ApplicationCommandOptionType, GuildMember, GuildMemberRoleManager } from "discord.js";
import { Discord, Slash, Client, SlashOption } from "discordx";
import { noBotPermsEmbedBUK, npEmbed, colors } from "../../utils/embeds.js";
import { getTranslated, format } from "../../languages/helper.js";
import { userAccountThing } from "../../utils/database.js";

@Discord()
export class BanCommand {
    @Slash({
        name: "ban",
        description: "A banhammer.",
    })
    async execute(
        @SlashOption({
            name: "member",
            description: "Member to ban! ofc",
            required: true,
            type: ApplicationCommandOptionType.User,
        })
        member: GuildMember,
        @SlashOption({
            name: "reason",
            description: "Reason ;-;",
            type: ApplicationCommandOptionType.String,
        })
        reason: string,
        interaction: CommandInteraction,
        bot: Client
    ): Promise<void> {
        await interaction.deferReply();
        const now = new Date();
        if (interaction.memberPermissions?.has("BanMembers") && (interaction.member?.roles as GuildMemberRoleManager).highest.position > member.roles.highest.position) {
            const user = await userAccountThing(interaction.user.id);
            if (!user) return;
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
}
