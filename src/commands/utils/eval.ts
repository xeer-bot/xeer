import { ApplicationCommandOptionType, type CommandInteraction } from "discord.js";
import { Discord, Slash, Client, Guard, SlashOption } from "discordx";
import { BotOwnerOnly } from "../../guards/devOnly.js";
import { errEmbed } from "../../utils/embeds.js";

@Discord()
export class InfoCommand {
    @Guard(BotOwnerOnly)
    @Slash({
        name: "eval",
        description: "Evaluates.",
    })
    async execute(
        @SlashOption({
            name: "code",
            description: "Code that you want to eval.",
            required: false,
            type: ApplicationCommandOptionType.String,
        })
        code: string,
        interaction: CommandInteraction,
        bot: Client
    ): Promise<void> {
        await interaction.deferReply();
        try {
            const result = await eval(code);
            let resultReplaced = "No output.";
            if (typeof result == "string") {
                resultReplaced = result.replace(bot.token ?? "😧", "no.");
            }
            interaction.followUp(resultReplaced);
        } catch (err) {
            if (err instanceof Error) {
                await interaction.followUp({ embeds: [errEmbed(err, undefined)] });
            } else {
                await interaction.followUp({ embeds: [errEmbed(new Error("An unexpected error occured!"), undefined)] });
            }
        }
    }
}
