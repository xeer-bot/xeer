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
import { colors, errEmbed } from "../../utils/embeds.js";
import { prisma } from "../../main.js";
export let BalanceCommand = class BalanceCommand {
    async execute(interaction, bot) {
        await interaction.deferReply();
        const now = new Date();
        const client = prisma;
        const user = await client.user.findFirst({ where: {
                id: interaction.user.id
            } });
        if (user) {
            interaction.followUp({
                embeds: [{
                        title: ":money_with_wings: Balance",
                        description: `<@${interaction.user.id}>'s Balance: $${user.cash}`,
                        color: colors.green,
                        timestamp: now.toISOString()
                    }]
            });
        }
        else {
            interaction.followUp({ embeds: [errEmbed(new Error(), "No account found in the database!\nTry again!")] });
            await client.user.create({ data: {
                    id: interaction.user.id,
                    cash: 0
                } });
        }
    }
};
__decorate([
    Slash({ name: "balance", description: "Economy : Balance" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Client]),
    __metadata("design:returntype", Promise)
], BalanceCommand.prototype, "execute", null);
BalanceCommand = __decorate([
    Discord()
], BalanceCommand);
