import { CommandInteraction, ApplicationCommandOptionType } from "discord.js";
import { Discord, Slash, Client, SlashOption } from "discordx";
import { noBotPermsEmbedBUK, npEmbed, colors } from "../../utils/embeds.js";

@Discord()
export class UnbanCommand {
    @Slash({
        name: "unban",
        description: "An unbanhammer.",
    })
    async execute(
        @SlashOption({
            name: "memberid",
            description: "Member to unban! ofc (ID)",
            required: true,
            type: ApplicationCommandOptionType.String,
        })
        member: string,
        interaction: CommandInteraction,
        bot: Client
    ): Promise<void> {
        await interaction.deferReply();
        const now = new Date();
        if (interaction.memberPermissions?.has("BanMembers")) {
            interaction.guild?.members
                .unban(member)
                .then(async (res) => {
                    await interaction.followUp({
                        embeds: [
                            {
                                title: ":hammer: Unbanhammer",
                                description: `<@${member}> was been unbanned!`,
                                color: colors.green,
                                timestamp: now.toISOString(),
                            },
                        ],
                    });
                })
                .catch(async (res) => {
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
