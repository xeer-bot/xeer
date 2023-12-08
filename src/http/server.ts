import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { bot, prisma } from "../main.js";
import * as logger from "../utils/logger.js";
import { cnfCache, hasAdministrator } from "../utils/connector_utils.js";
import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from 'url';

const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url));

const backend_url = "http://localhost:3000";

export async function get_dashboard_latency() {
    const before = new Date();
    try {
        await fetch(new URL("/ping", backend_url));
        const after = new Date();
        const latency = after.getTime() - before.getTime();
        return `🟢 ${latency}ms`;
    } catch (e) {
        return "🔴 OFFLINE";
    }
}

let cache: any = {};

export function setCache(newCache: any) {
    cache = newCache;
}

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", backend_url);
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

app.use(bodyParser.json());

const port = 443;

app.get("/teapot", async (req, res) => {
    res.status(418).json({ "message": "I don't serve coffee, because I'm a teapot! 🫖" })
})

app.get("/api/get_channels", async (req, res) => {
    const jData = req.query;
    const authorization = req.headers.authorization;

    if (!jData.guild_id || !authorization) { return res.status(400); }
    cache = await cnfCache(cache, authorization.toString());
    const id = cache[authorization.toString()];
    if (!id) { return res.status(500); }

    if (!hasAdministrator(bot, jData.guild_id.toString(), id)) {
        return res.status(403).json({
            error: true,
            message: "You don't have Administrator permission!",
        });
    }

    const guild = bot.guilds.cache.get(jData.guild_id.toString());
    if (!guild) { return res.status(403).json({ message: "You're not in that guild!" }); }
    
    let channels: any = [];
    guild.channels.cache.forEach((channel) => {
        if (channel.type == 0)
            channels.push({
                id: channel.id,
                name: channel.name,
            });
    });

    if (channels.length > 0) {
        res.json({
            channels: channels,
        });
    } else {
        res.status(500).json({
            error: true,
            message: "The bot is not added to that guild!",
        });
    }
});

app.get("/api/get_guilds", async (req, res) => {
    let { gids } = req.query;
    const authorization = req.headers.authorization;
    gids = gids?.toString().split(",");
    if (authorization && gids) {
        cache = await cnfCache(cache, authorization.toString());
        let guilds: any = [];
        gids.forEach((gid: any) => {
            const guild = bot.guilds.cache.get(gid);
            if (guild)
                guilds.push({
                    id: guild?.id,
                    name: guild?.name,
                });
        });
        res.json({
            guilds: guilds,
        });
    } else {
        return res.status(400);
    }
});

app.post("/api/save", async (req: Request, res: Response) => {
    let { feature, guild_id, data } = req.body;
    const authorization = req.headers.authorization;
    if (!feature || !authorization || !data || !guild_id) { return res.status(400); };

    cache = await cnfCache(cache, authorization.toString());
    const id = cache[authorization.toString()];
    if (!id) { return res.status(500); }

    if (!hasAdministrator(bot, guild_id.toString(), id)) {
        return res.status(403).json({
            error: true,
            message: "You don't have Administrator permission!",
        });
    }

    if (fs.existsSync(join(__dirname, "features", feature + ".ts"))) {
        (await import(`./features/${feature + ".ts"}`)).save(guild_id, data, res);
    } else {
        res.status(400).json({
            error: true,
            message: "Feature not implemented.",
        });
    }
});

export async function listen() {
    app.listen(port, () => {
        logger.success(`Listening on port ${port}.`);
    });
}
