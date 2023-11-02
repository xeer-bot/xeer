import type { CommandInteraction } from 'discord.js';
import { Discord, Slash, Client, Guard } from 'discordx';
import { executedRecently, prisma } from '../../main.js';
import { colors, errEmbed } from '../../utils/embeds.js';
import { userAccountThing } from '../../utils/database.js';
import { getRandomArbitrary } from '../../utils/main.js';

@Discord()
export class WorkCommand {
	@Slash({ name: 'work', description: 'Work!' })
	async execute(interaction: CommandInteraction, bot: Client): Promise<void> {
		await interaction.deferReply();
		if (!executedRecently.has(interaction.user.id)) {
			const messages = [
				'',
				'did your chores',
				"walked someone's dog",
				'washed a car',
				'worked in an office',
				'worked in a zoo',
				'developed a game',
				'built a house',
			];
			const now = new Date();
			const user = await userAccountThing(interaction.user.id);
			if (!user) return;
			const index = getRandomArbitrary(1, messages.length);
			const rCash = getRandomArbitrary(index * 2, index * 5);
			await interaction.followUp({
				embeds: [
					{
						title: ':construction_worker: Work',
						description: `You ${messages[index]} and got $${rCash}!`,
						color: colors.yellow,
						timestamp: now.toISOString(),
					},
				],
			});
			await prisma.user.update({
				data: {
					cash: (user.cash || 0) + rCash,
				},
				where: {
					id: interaction.user.id,
				},
			});
			executedRecently.add(interaction.user.id);
			setTimeout(() => {
				executedRecently.delete(interaction.user.id);
			}, 30000);
		} else
			await interaction.followUp({
				embeds: [errEmbed(new Error(), 'Try again in `30 seconds`!')],
			});
	}
}
