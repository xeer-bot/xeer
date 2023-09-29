var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Discord, On, Client } from "discordx";
import { prisma } from "../main.js";
import { createGuildConfiguration } from "../utils/database.js";
export let GuildMemberAdd = class GuildMemberAdd {
    async guildMemberAdd([member], bot, guardPayload) {
        const guildConfig = await prisma.guildConfiguration.findUnique({ where: { id: member.guild.id } });
        if (guildConfig) {
            if (guildConfig?.leavemsg != "" && guildConfig.leavemsg) {
                const ch = bot.channels.cache.get(guildConfig.leavechannel);
                const now = new Date();
                if (ch?.isTextBased()) {
                    guildConfig.leavemsg = guildConfig.leavemsg
                        .replaceAll("{user}", `${member}`)
                        .replaceAll("{timestamp}", now.toISOString())
                        .replaceAll("{guildname}", member.guild.name);
                    try {
                        guildConfig.leavemsg = JSON.parse(guildConfig.leavemsg);
                    }
                    catch (err) { }
                    await ch.send(guildConfig.leavemsg);
                }
            }
        }
        else {
            await createGuildConfiguration(member.guild.id);
        }
    }
};
__decorate([
    On({ event: "guildMemberRemove" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Client, Object]),
    __metadata("design:returntype", Promise)
], GuildMemberAdd.prototype, "guildMemberAdd", null);
GuildMemberAdd = __decorate([
    Discord()
], GuildMemberAdd);
