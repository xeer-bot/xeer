import { Discord, ArgsOf, On, Client } from 'discordx';
import { prisma } from '../main.js';
import { createGuildConfiguration } from '../utils/database.js';

@Discord()
export class GuildMemberAdd {
	@On({ event: 'guildMemberRemove' })
	async guildMemberAdd(
		[member]: ArgsOf<'guildMemberRemove'>,
		bot: Client,
		guardPayload: any
	) {
		const guildConfig = await prisma.guildConfiguration.findUnique({
			where: { id: member.guild.id },
		});
		if (guildConfig) {
			if (guildConfig?.leavemsg != '' && guildConfig.leavemsg) {
				const ch = bot.channels.cache.get(guildConfig.leavechannel);
				const now = new Date();
				if (ch?.isTextBased()) {
					guildConfig.leavemsg = guildConfig.leavemsg
						.replaceAll('{user}', `${member}`)
						.replaceAll('{timestamp}', now.toISOString())
						.replaceAll('{guildname}', member.guild.name);
					try {
						guildConfig.leavemsg = JSON.parse(guildConfig.leavemsg);
					} catch (err) {}
					await ch.send(guildConfig.leavemsg);
				}
			}
		} else {
			await createGuildConfiguration(member.guild.id);
		}
	}
}
