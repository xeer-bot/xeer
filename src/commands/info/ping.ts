import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { get_dashboard_latency } from "../../http/server.js";
import { XeerClient } from "../../main.js";

export default {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Checks bot's latency."),
    async execute(interaction: ChatInputCommandInteraction, bot: XeerClient) {
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
};