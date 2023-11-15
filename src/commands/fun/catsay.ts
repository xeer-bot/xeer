import { CommandInteraction, ApplicationCommandOptionType } from "discord.js";
import { Discord, Slash, Client, SlashOption } from "discordx";
import { colors } from "../../utils/embeds.js";
import { userAccountThing } from "../../utils/database.js";
import { format, getTranslated } from "../../languages/helper.js";

@Discord()
export class CatSayCommand {
    @Slash({
        name: "catsay",
        description: "A cat says something that you want.",
    })
    async execute(
        @SlashOption({
            name: "text",
            description: "Text for cat to say.",
            required: true,
            type: ApplicationCommandOptionType.String,
        })
        text: string,
        interaction: CommandInteraction,
        bot: Client
    ): Promise<void> {
        await interaction.deferReply();
        const now = new Date();
        const user = await userAccountThing(interaction.user.id);
        if (!user) return;
        await interaction.followUp({
            embeds: [JSON.parse(format(JSON.stringify(await getTranslated(user.language, "embeds", "cat_say")), text, encodeURIComponent(text)))],
        });
    }
}
