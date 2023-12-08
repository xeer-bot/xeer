import { CommandInteraction } from "discord.js";
import { Discord, Slash, Client } from "discordx";
import { userAccountThing } from "../../utils/database.js";
import { getTranslated } from "../../languages/helper.js";

@Discord()
export class CatSayCommand {
    @Slash({
        name: "cat",
        description: "Gives a random cat.",
    })
    async execute(interaction: CommandInteraction, bot: Client): Promise<void> {
        await interaction.deferReply();
        const now = new Date();
        const user = await userAccountThing(interaction.user.id);
        if (!user) return;
        await interaction.followUp({
            embeds: [await getTranslated(user.language, "embeds", "cat")],
        });
    }
}
