import {
	CommandInteraction,
	ApplicationCommandOptionType,
	User,
	ChannelType,
} from 'discord.js';
import { Discord, Slash, Client, SlashOption } from 'discordx';
import {
	noBotPermsEmbedBUK,
	npEmbed,
	colors,
	emojis,
} from '../../utils/embeds.js';

@Discord()
export class ClearCommand {
	@Slash({ name: 'clear', description: 'Deletes messages.' })
	async execute(
		@SlashOption({
			name: 'amount',
			description: 'How much messages I should delete?',
			required: true,
			type: ApplicationCommandOptionType.Number,
		})
		amount: number,
		interaction: CommandInteraction,
		bot: Client
	): Promise<void> {
		await interaction.deferReply();
		const now = new Date();
		if (interaction.channel?.type == ChannelType.DM)
			throw new Error("Channel's type is `DM`");
		if (amount > 100) throw new Error('Max amount is `100`!');
		if (amount < 0) throw new Error('Min amount is 0!');
		if (interaction.memberPermissions?.has('ManageMessages')) {
			await interaction.followUp('⏱️ Deleting messages...');
			await interaction.channel?.bulkDelete(amount, true);
			await interaction.channel?.send({
				embeds: [
					{
						title: `${emojis.success} Success!`,
						description: `Deleted ${amount} messages!`,
						color: colors.green,
						footer: {
							text: `Action requested by ${interaction.user.username}`,
						},
						timestamp: now.toISOString(),
					},
				],
			});
		} else {
			const e = npEmbed(undefined, 'Manage Messages');
			await interaction.followUp({
				embeds: [e],
			});
		}
	}
}
