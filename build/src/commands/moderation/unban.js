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
import { noBotPermsEmbedBUK, npEmbed, colors } from "../../utils/embeds.js";
export let UnbanCommand = class UnbanCommand {
    async execute(member, interaction, bot) {
        await interaction.deferReply();
        const now = new Date();
        if (interaction.memberPermissions?.has("BanMembers")) {
            interaction.guild?.members.unban(member).then(async (res) => {
                await interaction.followUp({
                    embeds: [{
                            title: ":hammer: Unbanhammer",
                            description: `<@${member}> was been unbanned!`,
                            color: colors.green,
                            timestamp: now.toISOString()
                        }]
                });
            }).catch(async (res) => {
                const e = noBotPermsEmbedBUK("Ban Members");
                await interaction.followUp({
                    embeds: [e]
                });
            });
        }
        else {
            const e = npEmbed(undefined, "Ban Members");
            await interaction.followUp({
                embeds: [e]
            });
        }
    }
};
__decorate([
    Slash({ name: "unban", description: "An unbanhammer." }),
    __param(0, SlashOption({
        name: "memberid",
        description: "Member to unban! ofc (ID)",
        required: true,
        type: ApplicationCommandOptionType.String
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CommandInteraction, Client]),
    __metadata("design:returntype", Promise)
], UnbanCommand.prototype, "execute", null);
UnbanCommand = __decorate([
    Discord()
], UnbanCommand);
