import fs from "fs";
import path from "path";
import { bot } from "../main.js";
import * as log from "../utils/logger.js";
import { fileURLToPath } from "url";
import { format } from "util";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
    
log.info("Registering commands and events...");

const foldersPath = path.join(__dirname, "../commands");  

const commandFolders = fs.readdirSync(foldersPath);
for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".ts")).map(file => file.replace(".ts", ".js"));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        // log.info(`Registering ${filePath}...`);
        try {
            let command = await import("file:///" + filePath);
            if (!command.default) { continue; } else { command = command.default; }
            if ("data" in command && "execute" in command) {
                bot.commands.set(command.data.name, command);
            } else {
                log.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        } catch (err: any) {
            log.error(`Failed to register ${filePath}: \n${format(err)}`);
        }
    }
}

const eventsPath = path.join(__dirname, "../events");
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".ts")).map(file => file.replace(".ts", ".js"));
for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    try {
        const event = await import("file:///" + filePath);
        if (event.once) {
            bot.once(event.name, async (...args) => await event.execute(...args));
        } else {
            bot.on(event.name, async (...args) => await event.execute(...args));
        }
    } catch (err: any) {
        log.error(`Failed to register ${filePath}: \n${format(err)}`);
    }
}