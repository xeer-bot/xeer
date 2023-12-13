import { ChatInputCommandInteraction } from "discord.js";
import { errEmbed } from "../utils/embeds.js";
import config from "../../botconfig.json" assert { type: "json" };

export function checkDev(interaction: ChatInputCommandInteraction) {
    if (interaction.user.id != config.ownerID) {
        interaction.followUp({
            embeds: [errEmbed(new Error(), "You're not an owner of this bot!")],
        });
        return false;
    } else true;
}
