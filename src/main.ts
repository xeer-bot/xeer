import type { ChatInputCommandInteraction, GuildMember, Interaction, SlashCommandBuilder } from "discord.js";
import { Client, IntentsBitField, Collection, REST, Routes } from "discord.js";
import * as log from "./utils/logger.js";
import { PrismaClient } from "@prisma/client";
import { title } from "./utils/main.js";
import { listen } from "./http/server.js";
import * as dotenv from "dotenv";
import { errEmbed } from "./utils/embeds.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import config from "../botconfig.json" assert { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

title();
await listen();

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

async function deployGuildCommands() {
    if (!process.env.BOT_TOKEN || !bot.application?.id) { log.error("Couldn't deploy commands due to no token or Application ID present."); return; }
    const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN || "");
    try {
        log.info(`Started deploying ${bot.commands.size} application (/) commands.`);
        const data = await rest.put(
            Routes.applicationGuildCommands(bot.application.id, config.guildID),
            { body: Array.from(bot.commands).map((cmd) => cmd[1].data.toJSON()) },
        ) as { length: number };
        log.success(`Successfully deployed ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
}

async function deployCommands() {
    if (!process.env.BOT_TOKEN || !bot.application?.id) { log.error("Couldn't deploy commands due to no token or Application ID present."); return; }
    const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN || "");
    try {
        log.info(`Started deploying ${bot.commands.size} application (/) commands.`);
        const data = await rest.put(
            Routes.applicationCommands(bot.application.id),
            { body: Array.from(bot.commands).map((cmd) => cmd[1].data.toJSON()) },
        ) as { length: number };
        log.success(`Successfully deployed ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
}

bot.once("ready", async () => {
    await bot.guilds.fetch();
    log.success(`Bot ready as ${bot.user?.username}.`);
    deployGuildCommands();
    const args = process.argv.slice(2);
    if (args[0] == "deploy-global-cmds") {
        log.info("Deploying commands...");
        deployCommands();
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
            await interaction.followUp({ embeds: [errEmbed(new Error(), err.toString())], ephemeral: true });
        } else {
            await interaction.reply({ embeds: [errEmbed(new Error(), err.toString())], ephemeral: true });
        }
    }
});

async function refresh() {
    const guilds = await bot.guilds.fetch();
    guilds.forEach((guild: any) => {
        setTimeout(async () => {
            const statisticsChannels = await prisma.statisticsChannels.findMany({
                where: {
                    gid: guild.id,
                },
            });
            if (!statisticsChannels) return;
            statisticsChannels.forEach(async (statisticsChannel) => {
                try {
                    const channel = await bot.channels.fetch(statisticsChannel.cid);
                    if (!channel) {
                        return;
                    }
                    if (channel?.isVoiceBased()) {
                        const guildFetched = await guild.fetch();
                        const guildMembersTotal = await guildFetched.members.fetch();
                        const guildMembers = guildMembersTotal.filter((m: GuildMember) => !m.user.bot);
                        const guildMembersOnline = guildMembers.filter((m: GuildMember) => m.presence?.status == "online" || m.presence?.status == "idle" || m.presence?.status == "dnd");
                        const guildBots = guildMembersTotal.filter((m: GuildMember) => m.user.bot);
                        let content = statisticsChannel.content;
                        content = content.replaceAll("{bots}", guildBots.size.toString());
                        content = content.replaceAll("{members}", guildMembers.size.toString());
                        content = content.replaceAll("{memberstotal}", guildMembersTotal.size.toString());
                        content = content.replaceAll("{membersonline}", guildMembersOnline.size.toString());
                        await channel?.setName(content);
                    }
                } catch (err) {
                    /* empty */
                }
            });
        }, 1000);
    });
    refresh();
}

const foldersPath = path.join(__dirname, "commands");

export function reload(commandName: string): boolean {
    log.info(`Trying to reload command ${commandName}.`);
    const command = bot.commands.get(commandName);
    if (command) {
        bot.commands.delete(commandName);
        import("file:///" + path.join(foldersPath, commandName) + ".js").then(content => {
            bot.commands.set(content.data.name, content);
            log.success(`Successfully reloaded command ${commandName}.`);
            return true;
        });
    } else {
        log.error(`Command ${commandName} doesn't exist.`);
        return false;
    }
    return false;
}

async function run() {
    log.info("Registering commands and events...");

    const commandFolders = fs.readdirSync(foldersPath);
    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".ts")).map(file => file.replace(".ts", ".js"));
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            // log.info(`Registering ${filePath}.`);
            let command = await import("file:///" + filePath);
            if (!command.default) { continue; } else { command = command.default; }
            if ("data" in command && "execute" in command) {
                bot.commands.set(command.data.name, command);
            } else {
                log.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }

    const eventsPath = path.join(__dirname, "events");
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".ts")).map(file => file.replace(".ts", ".js"));
    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = await import("file:///" + filePath);
        if (event.once) {
            bot.once(event.name, async (...args) => await event.execute(...args));
        } else {
            bot.on(event.name, async (...args) => await event.execute(...args));
        }
    }

    if (!process.env.BOT_TOKEN) {
        log.error("Couldn't find the BOT_TOKEN in your environment/configuration file (.env)!");
    } else {
        log.info("Logging in...");
        bot.login(process.env.BOT_TOKEN).then(async () => {
            await refresh();
        });
    }
}

run();
