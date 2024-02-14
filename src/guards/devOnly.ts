import { ChatInputCommandInteraction } from "discord.js";
import config from "../../bot_config.json" assert { type: "json" };
import { getTranslated } from "../languages/helper.js";

export async function checkDev(interaction: ChatInputCommandInteraction) {
    return new Promise(async (resolve, reject) => {
        if (interaction.user.id != config.ownerID) {
            await interaction.followUp({
                embeds: [await getTranslated("en_us", "embeds", "not_a_dev")],
            });
            resolve(false);
        } else resolve(true);
    });
}
