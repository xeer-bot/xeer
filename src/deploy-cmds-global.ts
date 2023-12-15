/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

// https://discordjs.guide/creating-your-bot/command-deployment.html#command-registration

import { REST, Routes } from "discord.js";
import botconfig from "../botconfig.json" assert { type: "json" };
const clientID = botconfig.clientID;
const guildID = botconfig.guildID;
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();
const token = process.env.BOT_TOKEN || "";

const commands = [];
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".ts")).map(file => file.replace(".ts", ".js"));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = await import("file:///" + filePath);
		if ("data" in command && "execute" in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const rest = new REST().setToken(token);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationCommands(clientID),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();