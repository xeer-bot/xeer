var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Discord, Slash, Client } from "discordx";
import { colors } from "../../utils/embeds.js";
export let PingCommand = class PingCommand {
    async execute(interaction, bot) {
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
};
__decorate([
    Slash({ name: "ping", description: "Measures the ping." }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Client]),
    __metadata("design:returntype", Promise)
], PingCommand.prototype, "execute", null);
PingCommand = __decorate([
    Discord()
], PingCommand);
