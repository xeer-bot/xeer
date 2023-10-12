import express from "express";
import bodyParser from "body-parser";
import { bot, prisma } from "../main.js";
import * as logger from "../utils/logger.js";
import { cnfCache, hasAdministrator } from "../utils/connector_utils.js";

const app = express();

const backend_url = 'http://localhost:3000'

export async function get_dashboard_latency() {
    const before = new Date();
    try {
        await fetch(new URL("/ping", backend_url));
        const after = new Date();
        const latency = after.getTime() - before.getTime();
        return `🟢 ${latency}ms`
    } catch (e) {
        return "🔴 OFFLINE";
    }
};

let cache: any = {}; 

export function setCache(newCache: any) {
    cache = newCache;
}

app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', backend_url);
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(bodyParser.json());

const port = 443;

app.get("/api/get_channels", async (req, res) => {
    const jData = req.query;
    if (jData.guild_id && jData.token) {
        try {
            cache = await cnfCache(cache, jData.token.toString());
        } catch (e) { res.status(500).json({ error: true, rtm: true, message: "Something unexpected happened!" }); }
        const id = cache[jData.token.toString()];
        if (id) {
            if (!hasAdministrator(bot, jData.guild_id.toString(), id)) return res.status(500).json({ error: true, rtm: true, message: "You don't have Administrator permission!" });
            const guild = bot.guilds.cache.get(jData.guild_id.toString());
            if (guild) {
                let channels: any = [];
                guild.channels.cache.forEach(channel => {
                    if (channel.type == 0) channels.push({ id: channel.id, name: channel.name });
                });
                if (channels.length > 0) {
                    res.json({ channels: channels });
                } else {
                    res.status(500).json({ error: true, rtm: true, message: "The bot is not added to that guild!" });
                }
            } else res.status(500).json({ error: true, rtm: true, message: "The bot is not added to that guild!" });
        } else res.status(500).json({ error: true, rtm: true, message: "Something unexpected happened!" });
    } else res.status(500).json({ error: true, rtm: true, message: "Wrong arguments!" });
});

app.get("/api/get_guilds", async (req, res) => {
    let { token, gids } = req.query;
    gids = gids?.toString().split(",");
    if (token && gids) {
        try {
            cache = await cnfCache(cache, token.toString());
        } catch (e) { res.status(500).json({ error: true, rtm: true, message: "Something unexpected happened!" }); }
        try {
            let guilds: any = [];
            gids.forEach((gid: any) => {
                const guild = bot.guilds.cache.get(gid);
                if (guild) guilds.push({ id: guild?.id, name: guild?.name  });
            });
            res.json({ guilds: guilds });
        } catch (error) { return res.status(500).json({ error: true, rtm: true, message: "Something went wrong, try again later!" }); };
    } else { return res.status(500).json({ error: true, rtm: true, message: "Wrong arguments!" }); };
});

app.post("/api/save", async (req, res) => {
    let { feature, token, guild_id, data } = req.body;
    if (feature && token && data && guild_id) {
        try {
            cache = await cnfCache(cache, token.toString());
        } catch (e) { res.status(500).json({ error: true, rtm: true, message: "Something unexpected happened!" }); }
        const id = cache[token.toString()];
        if (id) {
            if (!hasAdministrator(bot, guild_id.toString(), id)) return res.status(500).json({ error: true, rtm: true, message: "You don't have Administrator permission!" });
            if (feature == "welcomer") {
                try {
                    await prisma.guildConfiguration.update({ where: {
                        id: guild_id
                    }, data: {
                        welcomemsg: data.welcome_message,
                        welcomechannel: data.welcome_channel,
                        leavemsg: data.leave_message,
                        leavechannel: data.leave_channel
                    } });
                    res.json({ message: "Success!" });
                } catch (e) {
                    logger.error(e);
                    res.status(500).json({ error: true, rtm: true, message: "An error occured while trying to save!" });
                }
            }
        } else {
            res.status(500).json({ error: true, rtm: true, message: "Something unexpected happened!" });
        }
    } else res.status(500).json({ error: true, rtm: true, message: "Wrong arguments!" });
});

export async function listen() {
    app.listen(port, () => {
        logger.success(`Listening on port ${port}! :3`)
    });
}