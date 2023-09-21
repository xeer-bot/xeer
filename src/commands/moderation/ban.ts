import { CommandInteraction, ApplicationCommandOptionType, GuildMember, GuildMemberRoleManager } from "discord.js";
import { Discord, Slash, Client, SlashOption } from "discordx";
import { noBotPermsEmbedBUK, npEmbed, colors } from "../../utils/embeds.js";

@Discord()
export class BanCommand {
    @Slash({ name: "ban", description: "A banhammer." })
    async execute(
        @SlashOption({ 
            name: "member",
            description: "Member to ban! ofc",
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
        if (interaction.memberPermissions?.has("BanMembers") && (interaction.member?.roles as GuildMemberRoleManager).highest.position > member.roles.highest.position) {
            (await bot.users.fetch(member.id)).send({
                embeds: [{
                    title: ":hammer: Banhammer",
                    description: `You got banned from ${interaction.guild?.name}!\nReason: ${reason}`,
                    color: colors.red,
                    timestamp: now.toISOString()
                }]
            }).then(async () => {
                await ban(interaction, member, now, reason);
            }).catch(async () => {
                interaction.channel?.send(`\`❌ An error occured while DM'ing banned user, probably it had closed DM's.\``);
                await ban(interaction, member, now, reason);
            })
        } else {
            const e = npEmbed(undefined, "Ban Members");
            await interaction.followUp({
                embeds: [e]
            });
        }
    }
}

async function ban(interaction: CommandInteraction, member: GuildMember, now: Date, reason: string) {
    interaction.guild?.members.ban(member).then(async res => {
        await interaction.followUp({
            embeds: [{
                title: ":hammer: Banhammer",
                description: `${member} was been banned!\nReason: ${reason}`,
                color: colors.green,
                timestamp: now.toISOString()
            }]
        });
    }).catch(async () => {
        const e = noBotPermsEmbedBUK("Ban Members");
        await interaction.followUp({
            embeds: [e]
        });
    });
}
