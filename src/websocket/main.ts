import { WebSocketServer } from "ws";
import { bot } from "../main.js";
import * as logger from "../utils/logger.js";
import { cnfCache, cnrDU } from "../utils/ws_utils.js";

let cache: any = [];

let rlimit_settings: any = {
    max_per_ip: 3,
    time: 1000
}

let rlimit_data: any = {};
 
function rlimit_increase(ip: (string | undefined), amount: number) {
    if (ip == undefined) return;
    rlimit_data[ip].tokens - amount;
    setTimeout(() => {
        rlimit_data[ip].tokens + amount;
    }, rlimit_settings.time);
}

function rlimit_get(ip: (string | undefined)) {
    if (ip == undefined) return;
    if (rlimit_data[ip] == undefined) rlimit_data[ip] = { tokens: rlimit_settings.max_per_ip };
    return rlimit_data[ip].tokens;
}

const port = 443;

let wss = new WebSocketServer({ port: port });
wss.on("connection", (ws, req) => {
    ws.on("message", async (data) => {
        const remaining = rlimit_get(req.socket.remoteAddress);
        if (remaining <= 0) {
            ws.send("You're being ratelimited!");
        } else {
            const jData = JSON.parse(data.toString());
            switch (jData.action) {
                case "SAVE":
                    console.log("action chosen: save");
                    console.log(await cnrDU(bot, cache[jData.token]));
                case "GET_CHANNELS":
                    if (jData.gid) {
                        const guild = bot.guilds.cache.get(jData.gid);
                        if (guild) {
                            let channels: any = [];
                            guild.channels.cache.forEach(channel => {
                                channels.push({ id: channel.id, name: channel.name });
                            });
                            if (channels.length > 0)
                                ws.send(channels);
                            else
                                ws.send("Error: No channels found.");
                        } else ws.send(JSON.stringify({ error: true, rtm: true, message: "The bot is not added to that guild!" }));
                    }
                case "GET_USER_GUILDS":
                    if (jData.uid && jData.gids) {
                        let guilds: any = [];
                        jData.gids.forEach((gid: any) => {
                            const guild = bot.guilds.cache.get(gid);
                            if (guild) guilds.push({ id: guild?.id, name: guild?.name  });
                        });
                        ws.send(JSON.stringify({ response_to: "GET_USER_GUILDS", data: guilds }));
                    }
                default:
                    cache = await cnfCache(cache, jData.token);
                    ws.send("Connected!");
            }
        }
    });
});

export async function init() {
    logger.info(`Running WebSocket at port ${port}...`);
}