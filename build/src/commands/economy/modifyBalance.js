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
import { ApplicationCommandOptionType, User } from "discord.js";
import { Discord, Slash, Client, Guard, SlashOption, SlashGroup } from "discordx";
import { colors, emojis, errEmbed } from "../../utils/embeds.js";
import { BotOwnerOnly } from "../../guards/devOnly.js";
import { prisma } from "../../main.js";
export let ModifyBalanceCommand = class ModifyBalanceCommand {
    async set(cash, iuserr, interaction, bot) {
        const now = new Date();
        await interaction.deferReply();
        const iuser = iuserr || interaction.user;
        const user = await prisma.user.findUnique({ where: {
                id: iuser.id
            } });
        if (user) {
            await prisma.user.update({
                where: {
                    id: iuser.id
                },
                data: {
                    cash: cash
                }
            });
            await interaction.followUp({
                embeds: [{
                        title: `${emojis.success} Success!`,
                        description: `Operation completed successfully!`,
                        color: colors.green,
                        timestamp: now.toISOString()
                    }]
            });
        }
        else {
            await interaction.followUp({
                embeds: [errEmbed(new Error(), "No account found in the database!\nTry again!")]
            });
            await prisma.user.create({ data: {
                    id: iuser.id,
                    cash: 0
                } });
        }
    }
    async clear(iuserr, interaction, bot) {
        const now = new Date();
        await interaction.deferReply();
        const iuser = iuserr || interaction.user;
        const user = await prisma.user.findUnique({ where: {
                id: iuser.id
            } });
        if (user) {
            await prisma.user.update({
                where: {
                    id: iuser.id
                },
                data: {
                    cash: 0
                }
            });
            await interaction.followUp({
                embeds: [{
                        title: `${emojis.success} Success!`,
                        description: `Operation completed successfully!`,
                        color: colors.green,
                        timestamp: now.toISOString()
                    }]
            });
        }
        else {
            await interaction.followUp({
                embeds: [errEmbed(new Error(), "No account found in the database!\nTry again!")]
            });
            await prisma.user.create({ data: {
                    id: iuser.id,
                    cash: 0
                } });
        }
    }
    async get(iuserr, interaction, bot) {
        const now = new Date();
        await interaction.deferReply();
        const iuser = iuserr || interaction.user;
        const user = await prisma.user.findUnique({ where: {
                id: iuser.id
            } });
        if (user) {
            await interaction.followUp({
                embeds: [{
                        title: ":money_with_wings: Balance",
                        description: `<@${iuser.id || interaction.user.id}>'s Balance: $${user.cash}`,
                        color: colors.green,
                        timestamp: now.toISOString()
                    }]
            });
        }
        else {
            await interaction.followUp({
                embeds: [errEmbed(new Error(), "No account found in the database!\nTry again!")]
            });
            await prisma.user.create({ data: {
                    id: iuser.id,
                    cash: 0
                } });
        }
    }
};
__decorate([
    Slash({ description: "Economy : Sets the balance." }),
    Guard(BotOwnerOnly),
    __param(0, SlashOption({
        name: "newbalance",
        description: "New balance",
        required: true,
        type: ApplicationCommandOptionType.Number
    })),
    __param(1, SlashOption({
        name: "user",
        description: "User",
        required: false,
        type: ApplicationCommandOptionType.User
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, User, Function, Client]),
    __metadata("design:returntype", Promise)
], ModifyBalanceCommand.prototype, "set", null);
__decorate([
    Slash({ description: "Economy : Clears the balance." }),
    Guard(BotOwnerOnly),
    __param(0, SlashOption({
        name: "user",
        description: "User",
        required: false,
        type: ApplicationCommandOptionType.User
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User, Function, Client]),
    __metadata("design:returntype", Promise)
], ModifyBalanceCommand.prototype, "clear", null);
__decorate([
    Slash({ description: "Economy : Gets a balance." }),
    Guard(BotOwnerOnly),
    __param(0, SlashOption({
        name: "user",
        description: "User",
        required: false,
        type: ApplicationCommandOptionType.User
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User, Function, Client]),
    __metadata("design:returntype", Promise)
], ModifyBalanceCommand.prototype, "get", null);
ModifyBalanceCommand = __decorate([
    Discord(),
    SlashGroup({ name: "modifybalance", description: "Economy : Modify balance (Bot Owner only)" }),
    SlashGroup("modifybalance")
], ModifyBalanceCommand);
