import { ApplicationCommandOptionType, VoiceBasedChannel, type CommandInteraction, ChannelType } from "discord.js";
import { Discord, Slash, Client, SlashChoice, SlashOption, SlashGroup } from "discordx";
import { colors, emojis, errEmbed, npEmbed } from "../../utils/embeds.js";
import { prisma } from "../../main.js";
import { createGuildConfiguration, guildConfigurationThing, userAccountThing } from "../../utils/database.js";
import { getTranslated } from "../../languages/helper.js";

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
            description: "Name of the channel that you want to set (with placeholders).",
            required: true,
            type: ApplicationCommandOptionType.String,
        })
        channel_name: string,
        interaction: CommandInteraction,
        bot: Client
    ): Promise<void> {
        await interaction.deferReply();
        await interaction.followUp(`Selected subcommand: \`add\`\nSelected channel: ${channel}\nChannel "name": \`${channel_name}\``);
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
            description: "Name of the channel that you want to set (with placeholders).",
            required: true,
            type: ApplicationCommandOptionType.String,
        })
        channel_name: string,
        interaction: CommandInteraction,
        bot: Client
    ): Promise<void> {
        await interaction.deferReply();
        await interaction.followUp(`Selected subcommand: \`modify\`\nSelected channel: ${channel}\nChannel "name": \`${channel_name}\``);
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
        await interaction.followUp(`Selected subcommand: \`modify\`\nSelected channel: ${channel}`);
    }
}
