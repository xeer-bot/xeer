import { guildConfigurationThing } from "../utils/database.js";
import { ChannelType, Events, Message } from "discord.js";
import config from "../../bot_config.json" assert { type: "json" };
import { XeerClient } from "../main.js";

export default {
    name: Events.MessageCreate,
    once: false,
    async execute(msg: Message, bot: XeerClient) {
        try {
            const channel = msg.channel;
            if (msg.author.id == bot.user?.id) return;
            if (channel.type != ChannelType.GuildText) return;
            if (channel.name.split("-")[1] != "proxy") return;
            if (msg.author.id != config.ownerID) {
                return;
            }
            if (msg.content.includes("@everyone") || msg.content.includes("@here")) {
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
                await sendToChannel.send(msg.content);
                await msg.react("✅");
            }
        } catch (e) {
            msg.react("❌");
        }
    }
};
