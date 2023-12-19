import type { ChatInputCommandInteraction, GuildMember, Interaction, SlashCommandBuilder } from "discord.js";
import { Client, IntentsBitField, Collection, REST, Routes } from "discord.js";
import * as log from "./utils/logger.js";
import { PrismaClient } from "@prisma/client";
import { title } from "./utils/main.js";
import { listen } from "./http/server.js";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { refresh } from "./funcs/refresh.js";
import { deployCommands, deployGuildCommands, deleteCommands, deleteGuildCommands } from "./funcs/deployScripts.js";
import { getTranslated, format } from "./languages/helper.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

title();
await listen();

function importHelper(paths: string[]) {
    let current = 0;
    paths.forEach(path => {
        import(paths[current]).then(async () => {
            if (paths.length >= current) {
                await run();
            } else {
                current++;
            }
        });
    });
}

// Import funcs
importHelper([
    "./funcs/handler.js"
]);

dotenv.config();

export const prisma = new PrismaClient();
export const executedRecently = new Set();

interface SlashCommand {
    data: SlashCommandBuilder,
    execute: (interaction: ChatInputCommandInteraction, bot?: XeerClient) => void
}

export interface XeerClient extends Client {
    commands: Collection<string, SlashCommand>
}

export const bot = new Client({
    intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.GuildMessageReactions, IntentsBitField.Flags.GuildVoiceStates, IntentsBitField.Flags.MessageContent, IntentsBitField.Flags.GuildPresences],
}) as XeerClient;

bot.commands = new Collection();

bot.once("ready", async () => {
    await bot.guilds.fetch();
    log.success(`Bot ready as ${bot.user?.username}.`);
    const args = process.argv.slice(2);
    if (args[0] == "refresh-global-cmds") {
        await deleteCommands();
        await deployCommands();
    } else {
        await deleteGuildCommands();
        await deployGuildCommands();
    }
});

bot.on("interactionCreate", async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = bot.commands.get(interaction.commandName);

    if (!command) {
        log.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction, bot);
    } catch (err: any) {
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ embeds: [JSON.parse(format(JSON.stringify(getTranslated("en_us", "embeds", "error")), err.toString()))], ephemeral: true });
        } else {
            await interaction.reply({ embeds: [JSON.parse(format(JSON.stringify(getTranslated("en_us", "embeds", "error")), err.toString()))], ephemeral: true });
        }
    }
});

const foldersPath = path.join(__dirname, "commands");

export function reload(categoryName: string, commandName: string): boolean {
    log.info(`Trying to reload command ${commandName}.`);
    try {
        const command = bot.commands.get(commandName);
        const filePath = path.join(foldersPath, categoryName, commandName + ".js");
        const filePathTS = path.join(foldersPath, categoryName, commandName + ".ts");
        if (command && fs.existsSync(filePathTS)) {
            bot.commands.delete(commandName);
            import("file:///" + filePath).then(content => content.default).then(content => {
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

async function run() {
    if (!process.env.BOT_TOKEN) {
        log.error("Couldn't find the BOT_TOKEN in your environment/configuration file (.env)!");
    } else {
        log.info("Logging in...");
        bot.login(process.env.BOT_TOKEN).then(async () => {
            await refresh();
        });
    }
}