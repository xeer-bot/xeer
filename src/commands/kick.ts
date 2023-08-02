import { CommandInteraction, ApplicationCommandOptionType, GuildMember, GuildMemberRoleManager } from "discord.js";
import { Discord, Slash, Client, SlashOption } from "discordx";
import { npEmbed, noBotPermsEmbed } from "../utils/embeds.ts";

@Discord()
export class KickCommand {
    @Slash({ name: "kick", description: "...Kicks?" })
    async ping(
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
        const now = new Date();
        if (interaction.memberPermissions?.has("KickMembers") && (interaction.member?.roles as GuildMemberRoleManager).highest.position > member.roles.highest.position) {
            (await bot.users.fetch(member.id)).send({
                embeds: [{
                    title: "> :hammer: Kickhammer",
                    description: `You got kicked from ${interaction.guild?.name}!\nReason: ${reason}`,
                    color: 0x2b2d31,
                    timestamp: now.toISOString()
                }]
            }).then(async () => {
                await kick(interaction, member, now, reason);
            }).catch(async () => {
                interaction.channel?.send(`\`❌ An error occured while DM'ing kicked user, probably it had closed DM's.\``);
                await kick(interaction, member, now, reason);
            })
        } else {
            const e = npEmbed(undefined, "Kick Members", now);
            await interaction.reply({
                embeds: [e]
            });
        }
    }
}

async function kick(interaction: CommandInteraction, member: GuildMember, now: Date, reason: string) {
    interaction.guild?.members.kick(member).then(async res => {
        await interaction.reply({
            embeds: [{
                title: "> :hammer: Kickhammer",
                description: `${member} was been kicked!\nReason: ${reason}`,
                color: 0x2b2d31,
                timestamp: now.toISOString()
            }]
        });
    }).catch(async () => {
        const e = noBotPermsEmbed("Kick Members", now);
        await interaction.reply({
            embeds: [e]
        });
    });
}
