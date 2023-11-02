import { ApplicationCommandOptionType, ChannelType, type CommandInteraction } from "discord.js";
import { Discord, Slash, Client, SlashOption } from "discordx";
import { colors, emojis, errEmbed, npEmbed } from "../../utils/embeds.js";
import config from "../../../botconfig.json" assert { type: "json" };
import { guildConfigurationThing } from "../../utils/database.js";

@Discord()
export class SayCommand {
    @Slash({
        name: "say",
        description: "Sends a message.",
    })
    async execute(
        @SlashOption({
            name: "text",
            description: "Text to say.",
            required: true,
            type: ApplicationCommandOptionType.String,
        })
        text: string,
        @SlashOption({
            name: "channel_id",
            description: "Channel ID",
            required: false,
            type: ApplicationCommandOptionType.String,
        })
        cID: string,
        interaction: CommandInteraction,
        bot: Client
    ): Promise<void> {
        await interaction.deferReply();
        let chnl;
        if (cID) {
            chnl = bot.channels.cache.get(cID);
            if (chnl?.type != ChannelType.GuildText) {
                await interaction.followUp({
                    embeds: [errEmbed(new Error(), "Channel is not text-based!")],
                });
                return;
            }
            let user = null;
            const gidxd = chnl.guild;
            user = await gidxd.members.fetch(interaction.user.id);
            if (!user) {
                await interaction.followUp({
                    embeds: [errEmbed(new Error(), "You're not on this guild!")],
                });
                return;
            }
        }
        if (text.includes("@everyone") || text.includes("@here")) {
            await interaction.followUp({
                embeds: [errEmbed(new Error(), "You wish :3333")],
            });
            return;
        }
        const gID = chnl?.guildId || interaction.guild?.id || "";
        if (interaction.user.id == config.ownerID) {
            const guild = await guildConfigurationThing(gID);
            if (guild?.sendcmd_toggled == "allow") {
                if (cID) {
                    await chnl?.send(`${text}\n\nMessage sent from \`${interaction.guild?.name} (${interaction.guild?.id})\` by \`${interaction.user.username}\`.`);
                    const now = new Date();
                    await interaction.followUp({
                        embeds: [
                            {
                                title: `${emojis.success} Success!`,
                                description: `Operation completed successfully!`,
                                color: colors.green,
                                timestamp: now.toISOString(),
                            },
                        ],
                    });
                } else {
                    await interaction.followUp(text);
                }
            } else {
                await interaction.followUp({
                    embeds: [errEmbed(new Error(), "The guild doesn't allow `say` command!")],
                });
            }
        } else {
            await interaction.followUp({
                embeds: [npEmbed("You're not on the list of premium users!", undefined)],
            });
        }
    }
}
