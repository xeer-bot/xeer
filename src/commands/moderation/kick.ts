import { CommandInteraction, ApplicationCommandOptionType, GuildMember, GuildMemberRoleManager } from "discord.js";
import { Discord, Slash, Client, SlashOption } from "discordx";
import { npEmbed, noBotPermsEmbedBUK } from "../../utils/embeds.js";
import { getTranslated, format } from "../../languages/helper.js";
import { userAccountThing } from "../../utils/database.js";

@Discord()
export class KickCommand {
    @Slash({
        name: "kick",
        description: "A perfect command to kick someone.",
    })
    async execute(
        @SlashOption({
            name: "member",
            description: "Member to kick! ofc",
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
        if (interaction.memberPermissions?.has("KickMembers") && (interaction.member?.roles as GuildMemberRoleManager).highest.position > member.roles.highest.position) {
            const user = await userAccountThing(interaction.user.id);
            if (!user) return;
            (await bot.users.fetch(member.id))
                .send({
                    embeds: [JSON.parse(format(JSON.stringify(await getTranslated(user.language, "embeds", "got_kicked")), interaction.guild?.name, reason))],
                })
                .catch(async () => {
                    interaction.channel?.send(await getTranslated(user.language, "messages", "dm_noperms"));
                });
            interaction.guild?.members
                .kick(member)
                .then(async (res) => {
                    await interaction.followUp({
                        embeds: [JSON.parse(format(JSON.stringify(await getTranslated(user.language, "embeds", "user_kicked")), interaction.guild?.name, reason))],
                    });
                })
                .catch(async () => {
                    const e = noBotPermsEmbedBUK("Kick Members");
                    await interaction.followUp({
                        embeds: [e],
                    });
                });
        } else {
            const e = npEmbed(undefined, "Kick Members");
            await interaction.followUp({
                embeds: [e],
            });
        }
    }
}
