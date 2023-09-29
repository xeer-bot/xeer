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
import botconfig from "../../../botconfig.json" assert { type: "json" };
import pkg from "../../../package.json" assert { type: "json" };
export let InfoCommand = class InfoCommand {
    async execute(interaction, bot) {
        await interaction.deferReply();
        const now = new Date();
        let botowner = bot.users.cache.get(botconfig.ownerID)?.username;
        let description = `This instance is managed by ${botowner}.`;
        if (botconfig.ownerID == "1102609471542411326") {
            description = "This instance is an **official instance**.";
        }
        await interaction.followUp({
            embeds: [{
                    author: {
                        name: "Info about the bot.",
                        icon_url: bot.user?.avatarURL() || "https://ireland.apollo.olxcdn.com/v1/files/eyJmbiI6IjJsMDMyamp6dmw2Mi1PVE9NT1RPUEwifQ.xMAd58iLO7mmXPgYdkyyY63wN_Rwhbpsu6aNkqFaLZk/image"
                    },
                    description: description,
                    fields: [{
                            name: "Author:",
                            value: pkg.author,
                        },
                        {
                            name: "Commands:",
                            value: `${bot.application?.commands.cache.size.toString()} commands`
                        },
                        {
                            name: "Guilds:",
                            value: `${bot.guilds.cache.size.toString()} guilds`,
                            inline: true
                        }],
                    color: 0xFFFFFF,
                    timestamp: now.toISOString()
                }]
        });
    }
};
__decorate([
    Slash({ name: "info", description: "Info about the bot." }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Client]),
    __metadata("design:returntype", Promise)
], InfoCommand.prototype, "execute", null);
InfoCommand = __decorate([
    Discord()
], InfoCommand);
