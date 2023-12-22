import { LavalinkManager } from "lavalink-client";
import { bot } from "../main.js";
import * as log from "../utils/logger.js";
import dotenv from "dotenv";

dotenv.config();


bot.lavalink = new LavalinkManager({
    nodes: [{
        id: "node",
        host: process.env.LAVALINK_HOST || "localhost",
        port: Number(process.env.LAVALINK_PORT) || 2333,
        authorization: process.env.LAVALINK_PASS || "youshallnotpass"
    }],
    sendToShard: (guildId, payload) =>
        bot.guilds.cache.get(guildId)?.shard?.send(payload),
    client: {
        id: bot.application?.id || "", username: "TEST"
    } 
});
