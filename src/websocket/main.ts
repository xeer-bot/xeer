import { WebSocketServer } from "ws";
import { RateLimiter } from "limiter-es6-compat";
import { bot } from "../main.js";
import * as logger from "../utils/logger.js";
import { cnfCache } from "../utils/ws_utils.js";

let cache: any = [];

const limiter = new RateLimiter({ tokensPerInterval: 10, interval: "second" });

const port = 443;

let wss = new WebSocketServer({ port: port });
wss.on("connection", (ws) => {
    ws.on("message", async (data) => {
        const remaining = await limiter.removeTokens(1);
        if (remaining <= 0) {
            ws.send("You're being ratelimited!");
        } else {
            const jData = JSON.parse(data.toString());
            ws.send("Refreshing cache...");
            cache = await cnfCache(cache, jData.token);
            ws.send(`Your UID is ${cache[jData.token]}!`);
            switch (jData.action) {
                case "SAVE":
                    console.log("action chosen: save")
            }
        }
    });
});

export async function init() {
    logger.info(`Running WebSocket at port ${port}...`);
}