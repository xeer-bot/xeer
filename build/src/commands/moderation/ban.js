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
import { CommandInteraction, ApplicationCommandOptionType, GuildMember } from "discord.js";
import { Discord, Slash, Client, SlashOption } from "discordx";
import { noBotPermsEmbedBUK, npEmbed, colors } from "../../utils/embeds.js";
export let BanCommand = class BanCommand {
    async execute(member, reason, interaction, bot) {
        await interaction.deferReply();
        const now = new Date();
        if (interaction.memberPermissions?.has("BanMembers") && (interaction.member?.roles).highest.position > member.roles.highest.position) {
            (await bot.users.fetch(member.id)).send({
                embeds: [{
                        title: ":hammer: Banhammer",
                        description: `You got banned from ${interaction.guild?.name}!\nReason: ${reason}`,
                        color: colors.red,
                        timestamp: now.toISOString()
                    }]
            }).then(async () => {
                await ban(interaction, member, now, reason);
            }).catch(async () => {
                interaction.channel?.send(`\`❌ An error occured while DM'ing banned user, probably it had closed DM's.\``);
                await ban(interaction, member, now, reason);
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
    Slash({ name: "ban", description: "A banhammer." }),
    __param(0, SlashOption({
        name: "member",
        description: "Member to ban! ofc",
        required: true,
        type: ApplicationCommandOptionType.User
    })),
    __param(1, SlashOption({
        name: "reason",
        description: "Reason ;-;",
        type: ApplicationCommandOptionType.String
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GuildMember, String, CommandInteraction, Client]),
    __metadata("design:returntype", Promise)
], BanCommand.prototype, "execute", null);
BanCommand = __decorate([
    Discord()
], BanCommand);
async function ban(interaction, member, now, reason) {
    interaction.guild?.members.ban(member).then(async (res) => {
        await interaction.followUp({
            embeds: [{
                    title: ":hammer: Banhammer",
                    description: `${member} was been banned!\nReason: ${reason}`,
                    color: colors.green,
                    timestamp: now.toISOString()
                }]
        });
    }).catch(async () => {
        const e = noBotPermsEmbedBUK("Ban Members");
        await interaction.followUp({
            embeds: [e]
        });
    });
}
