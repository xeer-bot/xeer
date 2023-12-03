import { ApplicationCommandOptionType, VoiceBasedChannel, type CommandInteraction, ChannelType } from "discord.js";
import { Discord, Slash, Client, SlashChoice, SlashOption, SlashGroup } from "discordx";
import { colors, emojis, errEmbed, npEmbed } from "../../utils/embeds.js";
import { prisma } from "../../main.js";
import { createGuildConfiguration, guildConfigurationThing, userAccountThing } from "../../utils/database.js";
import { getTranslated, format } from "../../languages/helper.js";

@Discord()
@SlashGroup({
    name: "statistics",
    description: "Configurates statistics.",
})
@SlashGroup("statistics")
export class StatisticsCommand {
    @Slash({
        description: "Adds a new statistics channel.",
    })
    async add(
        @SlashOption({
            name: "channel",
            description: "Channel that you want to add.",
            required: true,
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [
                ChannelType.GuildVoice
            ]
        })
        channel: VoiceBasedChannel,
        @SlashOption({
            name: "channel_name",
            description: "Name of the channel that you want the bot to set (with placeholders).",
            required: true,
            type: ApplicationCommandOptionType.String,
        })
        channel_name: string,
        interaction: CommandInteraction,
        bot: Client
    ): Promise<void> {
        await interaction.deferReply();
        const user = await userAccountThing(interaction.user.id) || { language: "en_us" };
        if (interaction.memberPermissions?.has("Administrator")) {
            await prisma.statisticsChannels.create({
                data: {
                    cid: channel.id,
                    gid: interaction.guild?.id || "",
                    content: channel_name
                },
            });
            await interaction.followUp({ embeds: [await getTranslated(user?.language, "embeds", "success")] });
        } else {
            throw new Error(format(await getTranslated(user.language, "messages", "no_permission"), "Administrator"));
        }
    }
    @Slash({
        description: "Modifies a statistics channel.",
    })
    async modify(
        @SlashOption({
            name: "channel",
            description: "Channel that you want to modify.",
            required: true,
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [
                ChannelType.GuildVoice
            ]
        })
        channel: VoiceBasedChannel,
        @SlashOption({
            name: "channel_name",
            description: "Name of the channel that you want the bot to set (with placeholders).",
            required: true,
            type: ApplicationCommandOptionType.String,
        })
        channel_name: string,
        interaction: CommandInteraction,
        bot: Client
    ): Promise<void> {
        await interaction.deferReply();
        const user = await userAccountThing(interaction.user.id) || { language: "en_us" };
        if (interaction.memberPermissions?.has("Administrator")) {
            await prisma.statisticsChannels.update({
                where: {
                    cid: channel.id,
                    gid: interaction.guild?.id
                },
                data: {
                    content: channel_name
                }
            });
            await interaction.followUp({ embeds: [await getTranslated(user?.language, "embeds", "success")] });
        } else {
            throw new Error(format(await getTranslated(user.language, "messages", "no_permission"), "Administrator"));
        }
    }
    @Slash({
        description: "Removes a statistics channel.",
    })
    async remove(
        @SlashOption({
            name: "channel",
            description: "Channel that you want to remove.",
            required: true,
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [
                ChannelType.GuildVoice
            ]
        })
        channel: VoiceBasedChannel,
        interaction: CommandInteraction,
        bot: Client
    ): Promise<void> {
        await interaction.deferReply();
        const user = await userAccountThing(interaction.user.id) || { language: "en_us" };
        if (interaction.memberPermissions?.has("Administrator")) {
            await prisma.statisticsChannels.delete({
                where: {
                    cid: channel.id,
                    gid: interaction.guild?.id
                }
            });
            const user = await userAccountThing(interaction.user.id) || { language: "en_us" };
            await interaction.followUp({ embeds: [await getTranslated(user?.language, "embeds", "success")] });
        } else {
            throw new Error(format(await getTranslated(user.language, "messages", "no_permission"), "Administrator"));
        }
    }
    @Slash({
        description: "Lists all the statistics channels.",
    })
    async list(
        interaction: CommandInteraction,
        bot: Client
    ): Promise<void> {
        await interaction.deferReply();
        const user = await userAccountThing(interaction.user.id) || { language: "en_us" };
        const statisticsChannels = await prisma.statisticsChannels.findMany({
            where: {
                gid: interaction.guild?.id
            }
        });
        let string = ""
        for (let i = 0; i < statisticsChannels.length; i++) {
            string += `${i}. <#${statisticsChannels[i].cid}>: \`${statisticsChannels[i].content}\`\\n`;
        }
        interaction.followUp({
            embeds: [JSON.parse(format(JSON.stringify(await getTranslated(user.language, "embeds", "statistics_list")), string))],
        });
    }
}
