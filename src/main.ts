import { dirname, importx } from "@discordx/importer";
import type { Interaction, Message, CommandInteraction } from "discord.js";
import { IntentsBitField } from "discord.js";
import { Client } from "discordx";
import { success, error } from "./utils/logger.ts";
import { PrismaClient } from "@prisma/client";

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
    await bot.clearApplicationCommands(
        ...bot.guilds.cache.map((g) => g.id)
    );

    success(`Bot ready as ${bot.user?.username}.`);

});

bot.on("interactionCreate", async (interaction: (Interaction)) => {
    try {
        await bot.executeInteraction(interaction);
    } catch (err) {
        error(err);
    }
});

bot.on("messageCreate", (message: Message) => {
  	bot.executeCommand(message);
});

async function run() {
    await importx(`${dirname(import.meta.url)}/{events,commands}/**/*.{ts,js}`);

    if (!process.env.BOT_TOKEN) {
      	throw Error("Could not find BOT_TOKEN in your environment");
    }

    await bot.login(process.env.BOT_TOKEN);
}

run();
