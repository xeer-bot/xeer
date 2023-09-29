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
import { CommandInteraction, ApplicationCommandOptionType } from "discord.js";
import { Discord, Slash, Client, SlashOption } from "discordx";
import { errEmbed, colors } from "../../utils/embeds.js";
export let CatSayCommand = class CatSayCommand {
    async execute(text, interaction, bot) {
        await interaction.deferReply();
        const now = new Date();
        interaction.followUp({
            embeds: [{
                    title: ":cat: Cat.",
                    description: `Cat says: ${text}`,
                    image: {
                        url: `https://cataas.com/cat/says/${encodeURIComponent(text)}`
                    },
                    color: colors.yellow,
                    timestamp: now.toISOString()
                }]
        }).catch((err) => {
            interaction.followUp({
                embeds: [errEmbed(err, undefined)]
            });
        });
    }
};
__decorate([
    Slash({ name: "catsay", description: "A cat says something that you want." }),
    __param(0, SlashOption({
        name: "text",
        description: "Text for cat to say.",
        required: true,
        type: ApplicationCommandOptionType.String
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CommandInteraction, Client]),
    __metadata("design:returntype", Promise)
], CatSayCommand.prototype, "execute", null);
CatSayCommand = __decorate([
    Discord()
], CatSayCommand);
