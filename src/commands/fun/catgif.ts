import { CommandInteraction } from "discord.js";
import { Discord, Slash, Client } from "discordx";
import { colors } from "../../utils/embeds.js";
import { userAccountThing } from "../../utils/database.js";
import { getTranslated } from "../../languages/helper.js";

@Discord()
export class CatSayCommand {
    @Slash({
        name: "catgif",
        description: "Gives a random cat gif.",
    })
    async execute(interaction: CommandInteraction, bot: Client): Promise<void> {
        await interaction.deferReply();
        const now = new Date();
        const user = await userAccountThing(interaction.user.id);
        if (!user) return;
        await interaction.followUp({
            embeds: [await getTranslated(user.language, "embeds", "cat_gif")],
        });
    }
}
