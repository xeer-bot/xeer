import { ApplicationCommandOptionType, type CommandInteraction } from "discord.js";
import { Discord, Slash, Client, SlashChoice, SlashOption } from "discordx";
import { colors, emojis, errEmbed, npEmbed } from "../../utils/embeds.ts";
import { prisma } from "../../main.ts";
import { createGuildConfiguration } from "../../utils/database.ts";

@Discord()
export class ConfigurateCommand {
    @Slash({ name: "configurate", description: "The CONFIGURATOR 3000" })
    async execute(
        @SlashChoice({ name: "Welcome Message", value: "welcomemsg" })
        @SlashChoice({ name: "Leave Message", value: "leavemsg" })
        @SlashChoice({ name: "Welcome Message Channel ID", value: "welcomechannel" })
        @SlashChoice({ name: "Leave Message Channel ID", value: "leavechannel" })
        @SlashOption({ 
            name: "option",
            description: "Configuration Option",
            required: true,
            type: ApplicationCommandOptionType.String
        })
        option: string,
        @SlashOption({
            name: "text",
            description: "Text (Placeholders: {user}, {guildname}, {timestamp})",
            required: true,
            type: ApplicationCommandOptionType.String
        })
        text: string,
    interaction: CommandInteraction, bot: Client): Promise<void> {
        const gID = interaction.guild?.id || "";
        await interaction.deferReply();
        if (interaction.memberPermissions?.has("Administrator")) {
            if (await prisma.guildConfiguration.findUnique({ where: { id: gID } })) {
                const data: any = {};
                data[option] = text;
                await prisma.guildConfiguration.update({ where: {
                    id: gID
                }, data: data });
                const now = new Date();
                await interaction.followUp({ embeds: [{
                    title: `${emojis.success} Success!`,
                    description: `Operation completed successfully!`,
                    color: colors.green,
                    timestamp: now.toISOString()
                }] });
            } else {
                await interaction.followUp({ embeds: [errEmbed(new Error(), "Guild Configuration was made, please try again.")] });
                await createGuildConfiguration(gID);
            }
        } else {
            await interaction.followUp({ embeds: [npEmbed(undefined, "Administrator")] });
        }
    }
}
