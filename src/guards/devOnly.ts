import { GuardFunction } from "discordx";
import { CommandInteraction } from "discord.js";
import { npEmbed } from "../utils/embeds";
import config from "../../botconfig.json" assert { type: "json" };

export const BotOwnerOnly: GuardFunction<
    | CommandInteraction
> = async (arg, bot, next, guardData) => {
    const argObject = arg instanceof Array ? arg[0] : arg;
    const interaction: CommandInteraction = argObject;
    if (interaction.user.id != config.ownerID) {
        const now = new Date();
        await interaction.reply({ embeds: [{
            title: "No permission!",
            description: `You're not an owner of this bot!`,
            color: 0x2b2d31,
            footer: {
                text: "At least, you tried! :3"
            },
            timestamp: now.toISOString()
        }] });
    } else next();
}