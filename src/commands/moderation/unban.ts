import { CommandInteraction, ApplicationCommandOptionType } from "discord.js";
import { Discord, Slash, Client, SlashOption } from "discordx";
import { noBotPermsEmbedBUK, npEmbed } from "../../utils/embeds.js";
import { format, getTranslated } from "../../languages/helper.js";
import { userAccountThing } from "../../utils/database.js";

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
        const user = await userAccountThing(interaction.user.id);
        if (!user) return;
        if (interaction.memberPermissions?.has("BanMembers")) {
            interaction.guild?.members
                .unban(member)
                .then(async (res) => {
                    await interaction.followUp({
                        embeds: [JSON.parse(format(JSON.stringify(await getTranslated(user.language, "embeds", "user_unbanned")), member))],
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
