import { CommandInteraction, ApplicationCommandOptionType, ChannelType } from "discord.js";
import { Discord, Slash, Client, SlashOption } from "discordx";
import { npEmbed, colors, emojis } from "../../utils/embeds.js";
import { format, getTranslated } from "../../languages/helper.js";
import { userAccountThing } from "../../utils/database.js";

@Discord()
export class ClearCommand {
    @Slash({
        name: "clear",
        description: "Deletes messages.",
    })
    async execute(
        @SlashOption({
            name: "amount",
            description: "How much messages I should delete?",
            required: true,
            type: ApplicationCommandOptionType.Number,
        })
        amount: number,
        interaction: CommandInteraction,
        bot: Client
    ): Promise<void> {
        await interaction.deferReply();
        const now = new Date();
        const user = await userAccountThing(interaction.user.id);
        if (!user) return;
        if (interaction.channel?.type == ChannelType.DM) throw new Error("Channel's type is `DM`");
        if (amount > 100) throw new Error(await getTranslated(user.language, "messages", "max_amount_err"));
        if (amount < 0) throw new Error(await getTranslated(user.language, "messages", "min_amount_err"));
        if (interaction.memberPermissions?.has("ManageMessages")) {
            await interaction.followUp(await getTranslated(user.language, "messages", "deleting_msgs"));
            await interaction.channel?.bulkDelete(amount, true);
            await interaction.channel?.send({
                embeds: [JSON.parse(format(JSON.stringify(await getTranslated(user.language, "embeds", "deleted_msgs")), amount, interaction.user.username))],
            });
        } else {
            const e = npEmbed(undefined, "Manage Messages");
            await interaction.followUp({
                embeds: [e],
            });
        }
    }
}
