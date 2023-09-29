import { dirname, importx } from "@discordx/importer";
import { IntentsBitField } from "discord.js";
import { Client } from "discordx";
import * as log from "./utils/logger.js";
import { PrismaClient } from "@prisma/client";
import { title } from "./utils/main.js";
import { init } from "./websocket/main.js";
import * as dotenv from "dotenv";
title();
init();
dotenv.config();
export const prisma = new PrismaClient();
export const executedRecently = new Set();
export const bot = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.GuildVoiceStates,
    ],
    silent: true,
    simpleCommand: {
        prefix: "!",
    },
});
bot.once("ready", async () => {
    await bot.guilds.fetch();
    await bot.initApplicationCommands();
    await bot.clearApplicationCommands(...bot.guilds.cache.map((g) => g.id));
    log.success(`Bot ready as ${bot.user?.username}.`);
});
bot.on("interactionCreate", async (interaction) => {
    try {
        await bot.executeInteraction(interaction);
    }
    catch (err) {
        log.error(err);
    }
});
bot.on("messageCreate", (message) => {
    bot.executeCommand(message);
});
async function run() {
    await importx(`${dirname(import.meta.url)}/{events,commands}/**/*.{ts,js}`);
    if (!process.env.BOT_TOKEN) {
        log.error("Couldn't find the BOT_TOKEN in your environment/configuration file (.env)!");
    }
    else {
        log.info("Logging in...");
        await bot.login(process.env.BOT_TOKEN);
    }
}
run();
