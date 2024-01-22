import * as log from "../utils/logger.js";
import { REST, Routes } from "discord.js";
import config from "../../botconfig.json" assert { type: "json" };
import { bot } from "../main.js";

export async function deployGuildCommands() {
    if (!process.env.BOT_TOKEN || !bot.application?.id) { log.error("Couldn't deploy commands due to no token or Application ID present.", "Command Deploment"); return; }
    const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN || "");
    try {
        log.info(`Started deploying ${bot.commands.size} guild application (/) commands.`, "Command Deploment");
        const data = await rest.put(
            Routes.applicationGuildCommands(bot.application.id, config.guildID),
            { body: Array.from(bot.commands).map((cmd) => cmd[1].data.toJSON()) },
        ) as { length: number };
        log.success("Done.", "Command Deploment");
    } catch (error) {
        console.error(error);
    }
}

export async function deployCommands() {
    if (!process.env.BOT_TOKEN || !bot.application?.id) { log.error("Couldn't deploy commands due to no token or Application ID present.", "Command Deploment"); return; }
    const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN || "");
    try {
        log.info(`Started deploying ${bot.commands.size} application (/) commands.`, "Command Deploment");
        const data = await rest.put(
            Routes.applicationCommands(bot.application.id),
            { body: Array.from(bot.commands).map((cmd) => cmd[1].data.toJSON()) },
        ) as { length: number };
        log.success("Done.", "Command Deploment");
    } catch (error) {
        console.error(error);
    }
}

export async function deleteGuildCommands() {
    if (!process.env.BOT_TOKEN || !bot.application?.id) { log.error("Couldn't deploy commands due to no token or Application ID present.", "Command Deploment"); return; }
    const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN || "");
    try {
        log.info(`Started deleting ${bot.commands.size} guild application (/) commands.`, "Command Deploment");
        const data = await rest.put(
            Routes.applicationGuildCommands(bot.application.id, config.guildID),
            { body: [] },
        ) as { length: number };
        log.success("Done.", "Command Deploment");
    } catch (error) {
        console.error(error);
    }
}

export async function deleteCommands() {
    if (!process.env.BOT_TOKEN || !bot.application?.id) { log.error("Couldn't remove commands due to no token or Application ID present.", "Command Deploment"); return; }
    const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN || "");
    try {
        log.info(`Started deleting ${bot.commands.size} application (/) commands.`, "Command Deploment");
        const data = await rest.put(
            Routes.applicationCommands(bot.application.id),
            { body: [] },
        ) as { length: number };
        log.success("Done.", "Command Deploment");
    } catch (error) {
        console.error(error);
    }
}