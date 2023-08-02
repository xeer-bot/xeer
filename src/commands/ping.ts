import type { CommandInteraction } from "discord.js";
import { Discord, Slash, Client } from "discordx";

@Discord()
export class PingCommand {
    @Slash({ name: "ping", description: "Measures the ping." })
    async ping(interaction: CommandInteraction, bot: Client): Promise<void> {
        const now = new Date();
        const sent = await interaction.reply({ content: "⏱️ Measuring ping...", fetchReply: true });
        const roundtrip = sent.createdTimestamp - interaction.createdTimestamp;
        await interaction.editReply({
            embeds: [{
                title: "> ⏱️ Latency",
                description: `:stopwatch: Roundtrip latency: ${roundtrip}ms\n:heart: Websocket Heartbeat: ${bot.ws.ping}ms`,
                color: 0x2b2d31,
                timestamp: now.toISOString()
            }]
        });
    }
}
