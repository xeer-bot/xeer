import { dirname, importx, resolve } from "@discordx/importer";
import type { GuildMember, Interaction, Message } from "discord.js";
import { IntentsBitField } from "discord.js";
import { Client, DIService, MetadataStorage } from "discordx";
import * as log from "./utils/logger.js";
import { PrismaClient } from "@prisma/client";
import { title } from "./utils/main.js";
import { listen } from "./http/server.js";
import * as dotenv from "dotenv";
import { errEmbed } from "./utils/embeds.js";

title();
await listen();

dotenv.config();

export const prisma = new PrismaClient();
export const executedRecently = new Set();

export const bot = new Client({
    intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.GuildMessageReactions, IntentsBitField.Flags.GuildVoiceStates, IntentsBitField.Flags.MessageContent, IntentsBitField.Flags.GuildPresences],
    silent: true,
    simpleCommand: {
        prefix: "!",
    },
});

bot.once("ready", async () => {
    await bot.guilds.fetch();
    await bot.initApplicationCommands();

    log.success(`Bot ready as ${bot.user?.username}.`);
});

bot.on("interactionCreate", async (interaction: Interaction) => {
    try {
        await bot.executeInteraction(interaction);
    } catch (err) {
        if (err) {
            if (interaction.isCommand()) {
                if (interaction.deferred) {
                    interaction.followUp({
                        embeds: [errEmbed(new Error(), err.toString())],
                    });
                }
            }
        }
        log.error(err);
    }
});

bot.on("messageCreate", (message: Message) => {
    bot.executeCommand(message);
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

async function LoadFiles(src: string) {
    const files = await resolve(src);
    await Promise.all(files.map((file) => import(`${file}?version=${Date.now()}`)));
}

export async function reload() {
    log.warn("Reloading commands and events...");

    bot.removeEvents();
    MetadataStorage.clear();
    DIService.engine.clearAllServices();

    await LoadFiles(`${dirname(import.meta.url)}/{events,commands,commands-next}/**/*.{js,ts}`);

    await MetadataStorage.instance.build();
    await bot.initApplicationCommands();
    bot.initEvents();
}

async function run() {
    log.info("Registering commands and events...");
    await importx(`${dirname(import.meta.url)}/{events,commands}/**/*.{ts,js}`);

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
