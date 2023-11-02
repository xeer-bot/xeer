import type { CommandInteraction } from "discord.js";
import { Discord, Slash, Client } from "discordx";
import { get_dashboard_latency } from "../../http/server.js";

@Discord()
export class PingCommand {
    @Slash({
        name: "ping",
        description: "Measures the ping.",
    })
    async execute(interaction: CommandInteraction, bot: Client): Promise<void> {
        await interaction.deferReply();
        const now = new Date();
        const sent = await interaction.followUp({
            content: "⏱️ Measuring ping...",
            fetchReply: true,
        });
        const roundtrip = sent.createdTimestamp - interaction.createdTimestamp;
        await interaction.editReply({
            content: "",
            embeds: [
                {
                    title: ":stopwatch: Latency",
                    description: `> Roundtrip Latency: \`${roundtrip}ms\`\n> Websocket Heartbeat: \`${bot.ws.ping}ms\`\n> Dashboard Latency: \`${await get_dashboard_latency()}\``,
                    color: 0xffffff,
                    timestamp: now.toISOString(),
                },
            ],
        });
    }
}
