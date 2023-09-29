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
import { Discord, Slash, Client } from "discordx";
import { colors } from "../../utils/embeds.js";
export let CatSayCommand = class CatSayCommand {
    async execute(interaction, bot) {
        await interaction.deferReply();
        const now = new Date();
        await interaction.followUp({
            embeds: [{
                    title: ":cat: Random cat.",
                    description: `Random cat gif.`,
                    image: {
                        url: `https://cataas.com/cat/gif`
                    },
                    color: colors.yellow,
                    timestamp: now.toISOString()
                }]
        });
    }
};
__decorate([
    Slash({ name: "catgif", description: "Gives a random cat gif." }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CommandInteraction, Client]),
    __metadata("design:returntype", Promise)
], CatSayCommand.prototype, "execute", null);
CatSayCommand = __decorate([
    Discord()
], CatSayCommand);
