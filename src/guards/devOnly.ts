import { GuardFunction } from 'discordx';
import { CommandInteraction } from 'discord.js';
import { errEmbed } from '../utils/embeds.js';
import config from '../../botconfig.json' assert { type: 'json' };

export const BotOwnerOnly: GuardFunction<CommandInteraction> = async (
	arg,
	bot,
	next,
	guardData
) => {
	const argObject = arg instanceof Array ? arg[0] : arg;
	const interaction: CommandInteraction = argObject;
	if (interaction.user.id != config.ownerID) {
		await interaction.reply({
			embeds: [errEmbed(new Error(), "You're not an owner of this bot!")],
		});
	} else next();
};
