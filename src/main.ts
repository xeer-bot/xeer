import type { ChatInputCommandInteraction, Interaction, SlashCommandBuilder } from "discord.js";
import { Client, IntentsBitField, Collection } from "discord.js";
import * as log from "./utils/logger.js";
import { PrismaClient } from "@prisma/client";
import { title } from "./utils/main.js";
import { listenHttp } from "./http/server.js";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { refresh } from "./functions/refresh.js";
import { deployCommands, deployGuildCommands, deleteCommands, deleteGuildCommands } from "./functions/deployScripts.js";
import { getTranslated, format } from "./languages/helper.js";
import { userAccountThing } from "./utils/database.js";
import { listenWeb } from "./web/src/main.js";
import args from "../arguments.json" assert { type: "json" };
import { GlobalFonts } from "@napi-rs/canvas";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

title();
await listenHttp();
await listenWeb();

import("./handler/handler.js").then(async () => await run());

// If this throws an error somehow then insert a font into assets/fonts and name it "default.ttf".
GlobalFonts.registerFromPath(path.join(__dirname, "..", "assets", "fonts", "default.ttf"), "default");

dotenv.config();

export const prisma = new PrismaClient();
export const executedRecently = new Set();

interface SlashCommand {
    data: SlashCommandBuilder,
    execute: (interaction: ChatInputCommandInteraction, db_user_acc: any, bot?: XeerClient) => void
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
    log.success(`Bot ready as ${bot.user?.username}.`, "Ready Event");
    if (args.global_commands) {
        await deleteCommands();
        await deployCommands();
        await deleteGuildCommands();
    } else {
        await deleteGuildCommands();
        await deployGuildCommands();
    }
});

bot.on("interactionCreate", async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = bot.commands.get(interaction.commandName);

    if (!command) {
        log.error(`No command matching ${interaction.commandName} was found.`, "InteractionCreate Event");
        return;
    }

    try {
        const db_acc = await userAccountThing(interaction.user.id);
        if (!db_acc) return;
        await command.execute(interaction, db_acc, bot);
    } catch (err: any) {
        console.log(err);
        if (interaction.deferred) {
            await interaction.followUp({ embeds: [JSON.parse(format(JSON.stringify(await getTranslated("en_us", "embeds", "error")), err.message))], ephemeral: true });
        } else {
            await interaction.reply({ embeds: [JSON.parse(format(JSON.stringify(await getTranslated("en_us", "embeds", "error")), err.message))], ephemeral: true });
        }
    }
});

async function run() {
    if (!process.env.BOT_TOKEN) {
        log.error("Couldn't find the BOT_TOKEN in your environment/configuration file (.env)!", "Main");
    } else {
        log.info("Logging in...", "Main");
        bot.login(process.env.BOT_TOKEN).then(async () => {
            await refresh();
        });
    }
}