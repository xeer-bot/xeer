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
import { executedRecently, prisma } from "../../main.js";
import { colors, errEmbed } from "../../utils/embeds.js";
export let WorkCommand = class WorkCommand {
    async execute(interaction, bot) {
        await interaction.deferReply();
        if (!executedRecently.has(interaction.user.id)) {
            const messages = [
                "did your chores",
                "walked someone's dog",
                "washed a car",
                "worked in an office",
                "worked in a zoo",
                "was developing a game",
                "was building a house",
            ];
            const now = new Date();
            const client = prisma;
            const user = await client.user.findFirst({ where: {
                    id: interaction.user.id
                } });
            if (user) {
                const index = Math.floor(Math.random() * messages.length);
                const rCash = Math.floor(Math.random() * index * 5);
                await interaction.followUp({
                    embeds: [{
                            title: ":construction_worker: Work",
                            description: `You ${messages[index]} and got $${rCash}!`,
                            color: colors.yellow,
                            timestamp: now.toISOString()
                        }]
                });
                await client.user.update({
                    data: {
                        cash: (user.cash || 0) + rCash
                    },
                    where: {
                        id: interaction.user.id
                    }
                });
            }
            else {
                await interaction.followUp({ embeds: [errEmbed(new Error(), "No account found in the database!\nTry again!")] });
                await client.user.create({ data: {
                        id: interaction.user.id,
                        cash: 0
                    } });
            }
            executedRecently.add(interaction.user.id);
            setTimeout(() => {
                executedRecently.delete(interaction.user.id);
            }, 30000);
        }
        else
            await interaction.followUp({ embeds: [errEmbed(new Error(), "Try again in `30 seconds`!")] });
    }
};
__decorate([
    Slash({ name: "work", description: "Economy : Work" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Client]),
    __metadata("design:returntype", Promise)
], WorkCommand.prototype, "execute", null);
WorkCommand = __decorate([
    Discord()
], WorkCommand);
