import express from "express";
import { bot } from "../main.js";
import * as logger from "../utils/logger.js";
import cors from "cors";
import { cnfCache, hasAdministrator } from "../utils/connector_utils.js";

const app = express();

const backend_url = 'http://localhost:3000'

let cache: any = {}; 

app.use(cors({ origin: [backend_url], allowedHeaders: ["Access-Control-Allow-Origin"] }));

const port = 443;

app.get("/api/get_channels", (req, res) => {
    const jData = req.query;
    if (jData.guild_id && jData.token) {
        cnfCache(cache, jData.token.toString()).catch(e => res.status(500).json({ error: true, rtm: true, message: `Error: ${e}` })).then(c => cache = c);
        const id = cache[jData.token.toString()];
        if (id) {
            if (!hasAdministrator(bot, jData.guild_id.toString(), id)) res.status(500).json({ error: true, rtm: true, message: "You don't have Administrator permission!" });
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

app.get("/api/get_guilds", (req, res) => {
    let { token, gids } = req.query;
    gids = gids?.toString().split(",");
    if (token && gids) {
        cnfCache(cache, token.toString()).catch(e => res.status(500).json({ error: true, rtm: true, message: `${e}` })).then(c => cache = c);
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

app.post("/api/save", (req, res) => {
    let { feature, token, guild_id, data } = req.body;
    if (feature && token && data) {
        cnfCache(cache, token.toString()).catch(e => res.status(500).json({ error: true, rtm: true, message: `Error: ${e}` })).then(c => cache = c);
        const id = cache[token.toString()];
        if (id) {
            if (!hasAdministrator(bot, guild_id.toString(), id)) res.status(500).json({ error: true, rtm: true, message: "You don't have Administrator permission!" });
            
        } else {
            res.status(500).json({ error: true, rtm: true, message: "Something unexpected happened!" });
        }
    }
})

export async function listen() {
    app.listen(port, () => {
        logger.success(`Listening on port ${port}! :3`)
    });
}