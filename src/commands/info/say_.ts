import { ChannelType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { getTranslated } from "../../languages/helper.js";
import { bot } from "../../main.js";
import { userAccountThing, guildConfigurationThing } from "../../utils/database.js";
import { errEmbed } from "../../utils/embeds.js";
import config from "../../../botconfig.json";

export default {
    data: new SlashCommandBuilder()
        .setName("say")
        .setDescription("Sends a message.")
        .addStringOption(option => option.setName("text").setRequired(true))
        .addStringOption(option => option.setName("channel_id").setRequired(false)),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const text = interaction.options.getString("text") || "undefined :skull:";
        const cID = interaction.options.getString("channel_id");
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
        if (text.includes("@")) {
            await interaction.followUp({
                embeds: [errEmbed(new Error(), "You wish :3333")],
            });
            return;
        }
        const gID = chnl?.guildId || interaction.guild?.id || "";
        const user = (await userAccountThing(interaction.user.id)) || { language: "en_us", premium: false };
        if (user.premium) {
            const guild = await guildConfigurationThing(gID);
            if (guild?.sendcmd_toggled == "allow") {
                if (cID) {
                    if (interaction.user.id == config.ownerID) {
                        await chnl?.send(`${text}\n\nMessage sent from \`${interaction.guild?.name} (${interaction.guild?.id})\` by \`${interaction.user.username}\`.`);
                        const now = new Date();
                        await interaction.followUp({ embeds: [await getTranslated(user?.language, "embeds", "success")] });
                    }
                } else {
                    await interaction.followUp(text);
                }
            } else {
                await interaction.followUp({
                    embeds: [errEmbed(new Error(), "The guild doesn't allow `say` command!")],
                });
            }
        } else {
            await interaction.followUp({ embeds: [await getTranslated(user?.language, "embeds", "premium_not_active")] });
        }
    }
};