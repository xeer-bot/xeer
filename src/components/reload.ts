import * as log from "../utils/logger.js";
import path from "path";
import { format } from "util";
import { bot } from "../main.js";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const foldersPath = path.join(__dirname, "commands");

export function reload(categoryName: string, commandName: string): boolean {
    log.info(`Trying to reload command ${commandName}.`);
    try {
        const command = bot.commands.get(commandName);
        const filePath = path.join(foldersPath, categoryName, commandName + ".js");
        const filePathTS = path.join(foldersPath, categoryName, commandName + ".ts");
        if (command && fs.existsSync(filePathTS)) {
            bot.commands.delete(commandName);
            import("file:///" + filePath + `?v=${Date.now()}`).then(content => content.default).then(content => {
                bot.commands.set(content.data.name, content);
                log.success(`Successfully reloaded command ${commandName}.`);
            });
        } else {
            log.error(`Command ${commandName} doesn't exist.`);
            return false;
        }
        return true;
    } catch (err: any) {
        log.error(`An error occured while trying to reload ${commandName}: \n${format(err)}`);
        return false;
    }
}