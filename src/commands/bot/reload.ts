import { SlashCommandStringOption, type CommandInteraction, ApplicationCommandOptionType, PresenceStatusData } from "discord.js";
import { Discord, Slash, Client, Guard, SlashOption, SlashChoice } from "discordx";
import { BotOwnerOnly } from "../../guards/devOnly.js";
import { getTranslated, format } from "../../languages/helper.js";
import { reload } from "../../main.js";

@Discord()
export class Reload {
    @Slash({
        name: "reload",
        description: "Reloads commands.",
    })
    @Guard(BotOwnerOnly)
    async execute(
        interaction: CommandInteraction,
        bot: Client
    ): Promise<void> {
        await interaction.deferReply();
        try {
            const old = new Date();
            await reload();
            const new_ = new Date();
            const diff = ((new_.getTime() - old.getTime())/1000)
            await interaction.followUp({ embeds: [JSON.parse(format(JSON.stringify(await getTranslated("en_us", "embeds", "success_alt")), diff + "s"))] });
        } catch (err) {
            throw err
        }
    }
}
