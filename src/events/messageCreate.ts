import { Discord, ArgsOf, On, Client } from "discordx";
import { guildConfigurationThing } from "../utils/database.js";
import { ChannelType } from "discord.js";
import { colors, errEmbed, npEmbed } from "../utils/embeds.js";
import config from "../../botconfig.json" assert { type: "json" };

@Discord()
export class MessageCreate {
    @On({
        event: "messageCreate",
    })
    async messageCreate([msg]: ArgsOf<"messageCreate">, bot: Client, guardPayload: any) {
        try {
            const channel = msg.channel;
            if (msg.author.id == bot.user?.id) return;
            if (channel.type != ChannelType.GuildText) return;
            if (channel.name.split("-")[1] != "proxy") return;
            if (msg.author.id != config.ownerID) {
                await msg.reply({
                    embeds: [npEmbed("You're not an owner of this bot!", undefined)],
                });
                return;
            }
            if (msg.content.includes("@everyone") || msg.content.includes("@here")) {
                await msg.reply({
                    embeds: [errEmbed(new Error("You wish :3333"), undefined)],
                });
                return;
            }
            const sendToChannelID = channel.name.split("-")[0];
            const sendToChannel = await bot.channels.fetch(sendToChannelID);
            if (sendToChannel) {
                if (sendToChannel?.type != ChannelType.GuildText) return;
                if (!msg.member) return;
                const guildA = sendToChannel.guild;
                const user = await guildA.members.fetch(msg.author.id);
                const guildB = await guildConfigurationThing(guildA.id);
                if (guildB?.sendcmd_toggled == "allow") {
                    await sendToChannel.send(msg.content);
                    await msg.react("✅");
                } else {
                    await msg.reply({
                        embeds: [errEmbed(new Error(), "The guild doesn't allow `say` command!")],
                    });
                }
            }
        } catch (e) {
            await msg.reply({
                embeds: [errEmbed(new Error(), "I ate tacobell and crashed! :(")],
            });
        }
    }
}
