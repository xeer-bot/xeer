import {
	SlashCommandStringOption,
	type CommandInteraction,
	ApplicationCommandOptionType,
	PresenceStatusData,
} from 'discord.js';
import {
	Discord,
	Slash,
	Client,
	Guard,
	SlashOption,
	SlashChoice,
} from 'discordx';
import { colors } from '../../utils/embeds.js';
import { BotOwnerOnly } from '../../guards/devOnly.js';

@Discord()
export class ChangePresenceCommand {
	@Slash({
		name: 'presence',
		description: "Changes bot's presence! (Bot Owner only)",
	})
	@Guard(BotOwnerOnly)
	async execute(
		@SlashOption({
			name: 'text',
			description: "Activity's text",
			required: true,
			type: ApplicationCommandOptionType.String,
		})
		text: string,
		@SlashChoice({ name: 'Playing', value: 0 })
		@SlashChoice({ name: 'Streaming', value: 1 })
		@SlashChoice({ name: 'Listening', value: 2 })
		@SlashChoice({ name: 'Watching', value: 3 })
		@SlashChoice({ name: 'Competing', value: 5 })
		@SlashOption({
			name: 'type',
			description: "Activity's type",
			required: true,
			type: ApplicationCommandOptionType.Number,
		})
		type: number,
		@SlashChoice({ name: 'Online', value: 'online' })
		@SlashChoice({ name: 'Idle', value: 'idle' })
		@SlashChoice({ name: 'Do not disturb', value: 'dnd' })
		@SlashChoice({ name: 'Invisible', value: 'invisible' })
		@SlashOption({
			name: 'status',
			description: "Bot's status",
			required: true,
			type: ApplicationCommandOptionType.String,
		})
		status: PresenceStatusData,
		interaction: CommandInteraction,
		bot: Client
	): Promise<void> {
		const now = new Date();
		await interaction.deferReply();
		bot.user?.setPresence({
			activities: [
				{
					name: text,
					type: type,
				},
			],
			status: status,
		});
		await interaction.followUp({
			embeds: [
				{
					title: '<a:success:1138106613559996521> Success!',
					description: `Operation completed successfully!`,
					color: colors.green,
					timestamp: now.toISOString(),
				},
			],
		});
	}
}
