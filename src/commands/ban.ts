import { CommandInteraction, ApplicationCommandOptionType, GuildMember, GuildMemberRoleManager } from "discord.js";
import { Discord, Slash, Client, SlashOption } from "discordx";
import { noBotPermsEmbed, npEmbed } from "../utils/embeds.ts";

@Discord()
export class BanCommand {
    @Slash({ name: "ban", description: "...Bans?" })
    async ping(
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
        const now = new Date();
        if (interaction.memberPermissions?.has("BanMembers") && (interaction.member?.roles as GuildMemberRoleManager).highest.position > member.roles.highest.position) {
            (await bot.users.fetch(member.id)).send({
                embeds: [{
                    title: "> :hammer: Banhammer",
                    description: `You got banned from ${interaction.guild?.name}!\nReason: ${reason}`,
                    color: 0x2b2d31,
                    timestamp: now.toISOString()
                }]
            }).then(async () => {
                await ban(interaction, member, now, reason);
            }).catch(async () => {
                interaction.channel?.send(`\`❌ An error occured while DM'ing banned user, probably it had closed DM's.\``);
                await ban(interaction, member, now, reason);
            })
        } else {
            const e = npEmbed(undefined, "Ban Members", now);
            await interaction.reply({
                embeds: [e]
            });
        }
    }
}

async function ban(interaction: CommandInteraction, member: GuildMember, now: Date, reason: string) {
    interaction.guild?.members.ban(member).then(async res => {
        await interaction.reply({
            embeds: [{
                title: "> :hammer: Banhammer",
                description: `${member} was been banned!\nReason: ${reason}`,
                color: 0x2b2d31,
                timestamp: now.toISOString()
            }]
        });
    }).catch(async () => {
        const e = noBotPermsEmbed("Ban Members", now);
        await interaction.reply({
            embeds: [e]
        });
    });
}
