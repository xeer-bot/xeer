import type { CommandInteraction } from "discord.js";
import { Discord, Slash, Client } from "discordx";
import { colors } from "../../utils/embeds.ts";

@Discord()
export class PingCommand {
    @Slash({ name: "ping", description: "Measures the ping." })
    async execute(interaction: CommandInteraction, bot: Client): Promise<void> {
        await interaction.deferReply();
        const now = new Date();
        const sent = await interaction.followUp({ content: "⏱️ Measuring ping...", fetchReply: true });
        const roundtrip = sent.createdTimestamp - interaction.createdTimestamp;
        await interaction.editReply({
            content: "",
            embeds: [{
                title: ":stopwatch: Latency",
                description: `:stopwatch: Roundtrip latency: ${roundtrip}ms\n:heart: Websocket Heartbeat: ${bot.ws.ping}ms`,
                color: colors.primary,
                timestamp: now.toISOString()
            }]
        });
    }
}
