import { CommandInteraction, ApplicationCommandOptionType, GuildMember, GuildMemberRoleManager } from "discord.js";
import { Discord, Slash, Client, SlashOption } from "discordx";
import { npEmbed, noBotPermsEmbedBUK, colors } from "../../utils/embeds.ts";

@Discord()
export class KickCommand {
    @Slash({ name: "kick", description: "...Kicks?" })
    async execute(
        @SlashOption({ 
            name: "member",
            description: "Member to kick! ofc",
            required: true,
            type: ApplicationCommandOptionType.User
        })
        member: GuildMember,
        @SlashOption({ 
            name: "reason",
            description: "Reason ;-;",
            type: ApplicationCommandOptionType.String
        })
        reason: string,
    interaction: CommandInteraction, bot: Client): Promise<void> {
        await interaction.deferReply();
        const now = new Date();
        if (interaction.memberPermissions?.has("KickMembers") && (interaction.member?.roles as GuildMemberRoleManager).highest.position > member.roles.highest.position) {
            (await bot.users.fetch(member.id)).send({
                embeds: [{
                    title: ":hammer: Kickhammer",
                    description: `You got kicked from ${interaction.guild?.name}!\nReason: ${reason}`,
                    color: colors.red,
                    timestamp: now.toISOString()
                }]
            }).then(async () => {
                await kick(interaction, member, now, reason);
            }).catch(async () => {
                interaction.channel?.send(`\`❌ An error occured while DM'ing kicked user, probably it had closed DM's.\``);
                await kick(interaction, member, now, reason);
            })
        } else {
            const e = npEmbed(undefined, "Kick Members");
            await interaction.followUp({
                embeds: [e]
            });
        }
    }
}

async function kick(interaction: CommandInteraction, member: GuildMember, now: Date, reason: string) {
    interaction.guild?.members.kick(member).then(async res => {
        await interaction.followUp({
            embeds: [{
                title: ":hammer: Kickhammer",
                description: `${member} was been kicked!\nReason: ${reason}`,
                color: colors.green,
                timestamp: now.toISOString()
            }]
        });
    }).catch(async () => {
        const e = noBotPermsEmbedBUK("Kick Members");
        await interaction.followUp({
            embeds: [e]
        });
    });
}
