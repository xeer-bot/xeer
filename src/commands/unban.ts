import { CommandInteraction, ApplicationCommandOptionType, User } from "discord.js";
import { Discord, Slash, Client, SlashOption } from "discordx";
import { noBotPermsEmbed, npEmbed } from "../utils/embeds.ts";

@Discord()
export class UnbanCommand {
    @Slash({ name: "unban", description: "...Unbans?" })
    async ping(
        @SlashOption({ 
            name: "memberid",
            description: "Member to unban! ofc (ID)",
            required: true,
            type: ApplicationCommandOptionType.String
        })
        member: string,
    interaction: CommandInteraction, bot: Client): Promise<void> {
        const now = new Date();
        if (interaction.memberPermissions?.has("BanMembers")) {
            interaction.guild?.members.unban(member).then(async res => {
                await interaction.reply({
                    embeds: [{
                        title: "> :hammer: Banhammer",
                        description: `<@${member}> was been unbanned!`,
                        color: 0x2b2d31,
                        timestamp: now.toISOString()
                    }]
                });
            }).catch(async res => {
                const e = noBotPermsEmbed("Ban Members", now);
                await interaction.reply({
                    embeds: [e]
                });
            });
        } else {
            const e = npEmbed(undefined, "Ban Members", now);
            await interaction.reply({
                embeds: [e]
            });
        }
    }
}
