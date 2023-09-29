var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";
const peppinos = [];
export let PeppinoCommand = class PeppinoCommand {
    async execute(interaction) {
        interaction.reply("https://cdn.discordapp.com/attachments/1140330918876299339/1151506124978274415/c65dc2d81aa671f550ad2c5cb6121d98.png");
    }
};
__decorate([
    Slash({ name: "peppino", description: "!!! USE WITH CAUTION !!!" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CommandInteraction]),
    __metadata("design:returntype", Promise)
], PeppinoCommand.prototype, "execute", null);
PeppinoCommand = __decorate([
    Discord()
], PeppinoCommand);
