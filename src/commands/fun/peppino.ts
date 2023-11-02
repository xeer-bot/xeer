import { CommandInteraction } from 'discord.js';
import { Discord, Slash } from 'discordx';

const peppinos = [];

@Discord()
export class PeppinoCommand {
	@Slash({ name: 'peppino', description: '!!! USE WITH CAUTION !!!' })
	async execute(interaction: CommandInteraction): Promise<void> {
		interaction.reply(
			'https://cdn.discordapp.com/attachments/1140330918876299339/1151506124978274415/c65dc2d81aa671f550ad2c5cb6121d98.png'
		);
	}
}
