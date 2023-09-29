var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { ApplicationCommandOptionType } from "discord.js";
import { Discord, Slash, Client, Guard, SlashOption, SlashChoice } from "discordx";
import { colors } from "../../utils/embeds.js";
import { BotOwnerOnly } from "../../guards/devOnly.js";
export let ChangePresenceCommand = class ChangePresenceCommand {
    async execute(text, type, status, interaction, bot) {
        const now = new Date();
        await interaction.deferReply();
        bot.user?.setPresence({
            activities: [{
                    name: text,
                    type: type
                }],
            status: status
        });
        await interaction.followUp({
            embeds: [{
                    title: "<a:success:1138106613559996521> Success!",
                    description: `Operation completed successfully!`,
                    color: colors.green,
                    timestamp: now.toISOString()
                }]
        });
    }
};
__decorate([
    Slash({ name: "presence", description: "Changes bot's presence! (Bot Owner only)" }),
    Guard(BotOwnerOnly),
    __param(0, SlashOption({
        name: "text",
        description: "Activity's text",
        required: true,
        type: ApplicationCommandOptionType.String
    })),
    __param(1, SlashChoice({ name: "Playing", value: 0 })),
    __param(1, SlashChoice({ name: "Streaming", value: 1 })),
    __param(1, SlashChoice({ name: "Listening", value: 2 })),
    __param(1, SlashChoice({ name: "Watching", value: 3 })),
    __param(1, SlashChoice({ name: "Competing", value: 5 })),
    __param(1, SlashOption({
        name: "type",
        description: "Activity's type",
        required: true,
        type: ApplicationCommandOptionType.Number
    })),
    __param(2, SlashChoice({ name: "Online", value: "online" })),
    __param(2, SlashChoice({ name: "Idle", value: "idle" })),
    __param(2, SlashChoice({ name: "Do not disturb", value: "dnd" })),
    __param(2, SlashChoice({ name: "Invisible", value: "invisible" })),
    __param(2, SlashOption({
        name: "status",
        description: "Bot's status",
        required: true,
        type: ApplicationCommandOptionType.String
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String, Function, Client]),
    __metadata("design:returntype", Promise)
], ChangePresenceCommand.prototype, "execute", null);
ChangePresenceCommand = __decorate([
    Discord()
], ChangePresenceCommand);
