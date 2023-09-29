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
import { Discord, Slash, Client, SlashChoice, SlashOption } from "discordx";
import { colors, emojis, errEmbed, npEmbed } from "../../utils/embeds.js";
import { prisma } from "../../main.js";
import { createGuildConfiguration } from "../../utils/database.js";
export let ConfigurateCommand = class ConfigurateCommand {
    async execute(option, text, interaction, bot) {
        await interaction.deferReply();
        const gID = interaction.guild?.id || "";
        if (interaction.memberPermissions?.has("Administrator")) {
            if (await prisma.guildConfiguration.findUnique({ where: { id: gID } })) {
                const data = {};
                if (option.endsWith("_toggled")) {
                    text = text.toLowerCase();
                    if (text != ("allow" || "disallow"))
                        await interaction.followUp({ embeds: [errEmbed(new Error(), "Wrong text, I only accept `ALLOW` or `DISALLOW`.")] });
                    return;
                }
                ;
                data[option] = text;
                await prisma.guildConfiguration.update({ where: {
                        id: gID
                    }, data: data });
                const now = new Date();
                await interaction.followUp({ embeds: [{
                            title: `${emojis.success} Success!`,
                            description: `Operation completed successfully!`,
                            color: colors.green,
                            timestamp: now.toISOString()
                        }] });
            }
            else {
                await createGuildConfiguration(gID);
                await interaction.followUp({ embeds: [errEmbed(new Error(), "Guild Configuration was made, please try again.")] });
            }
        }
        else {
            await interaction.followUp({ embeds: [npEmbed(undefined, "Administrator")] });
        }
    }
};
__decorate([
    Slash({ name: "configurate", description: "Configure the Welcome/Leave Messages and their Channel's IDs" }),
    __param(0, SlashChoice({ name: "Welcome Message", value: "welcomemsg" })),
    __param(0, SlashChoice({ name: "Leave Message", value: "leavemsg" })),
    __param(0, SlashChoice({ name: "Welcome Message Channel ID", value: "welcomechannel" })),
    __param(0, SlashChoice({ name: "Leave Message Channel ID", value: "leavechannel" })),
    __param(0, SlashChoice({ name: "Send Command (ALLOW or DISALLOW)", value: "sendcmd_toggled" })),
    __param(0, SlashOption({
        name: "option",
        description: "Configuration Option",
        required: true,
        type: ApplicationCommandOptionType.String
    })),
    __param(1, SlashOption({
        name: "text",
        description: "Text (Placeholders: {user}, {guildname}, {timestamp})",
        required: true,
        type: ApplicationCommandOptionType.String
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Function, Client]),
    __metadata("design:returntype", Promise)
], ConfigurateCommand.prototype, "execute", null);
ConfigurateCommand = __decorate([
    Discord()
], ConfigurateCommand);
