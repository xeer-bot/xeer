import { Manager } from "lavacord";
import { bot } from "../main.js";
import * as log from "../utils/logger.js";

const nodes = [{
    id: "1",
    host: "localhost",
    port: 2333,
    password: "lol"
}];

const manager = new Manager(nodes, {
    user: bot.user?.id,
    send: (packet) => {}
});

log.info("Connecting to Lavalink Node...");
await manager.connect();

manager.on("error", (error, node) => {
   /* empty */ 
});
