import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { getTranslated } from "../../languages/helper.js";
import { prisma } from "../../main.js";
import { guildConfigurationThing, userAccountThing } from "../../utils/database.js";
import { errEmbed, npEmbed } from "../../utils/embeds.js";

export default {
    data: new SlashCommandBuilder()
        .setName("configurate")
        .setDescription("Configure feature's settings.")
        .addStringOption((option: any) =>
            option
            .setName("option")
            .setDescription("Configuration Option")
            .addChoices(
                { name: "Welcome Message", value: "welcomemsg" },
                { name: "Leave Message", value: "leavemsg" },
                { name: "Welcome Message Channel ID", value: "welcomechannel" },
                { name: "Leave Message Channel ID", value: "leavechannel" },
                { name: "Send Command (ALLOW or DISALLOW)", value: "sendcmd_toggled" },
            )
            .setRequired(true)
        )
        .addStringOption((option: any) => option.setName("text").setDescription("Text (Placeholders: {user}, {guildname}, {timestamp})").setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const option = interaction.options.getString("option");
        let text = interaction.options.getString("text");
        const user = await userAccountThing(interaction.user.id);
        const gID = interaction.guild?.id || "";
        if (!user) return;
        if (!option || !text) {
            await interaction.followUp({
                embeds: [await getTranslated(user.language, "embeds", "success")],
            });
            return;
        }
        if (interaction.memberPermissions?.has("Administrator")) {
            await guildConfigurationThing(interaction.guild?.id || "");
            const data: any = {};
            if (option.endsWith("_toggled")) {
                text = text.toLowerCase();
                if (text != "allow" && text != "disallow") {
                    await interaction.followUp({
                        embeds: [errEmbed(new Error(), "Wrong text, I only accept `ALLOW` or `DISALLOW`.")],
                    });
                    return;
                }
            }
            data[option] = text;
            await prisma.guildConfiguration.update({
                where: {
                    id: gID,
                },
                data: data,
            });
            const now = new Date();
            await interaction.followUp({
                embeds: [await getTranslated(user.language, "embeds", "success")],
            });
        } else {
            await interaction.followUp({
                embeds: [npEmbed(undefined, "Administrator")],
            });
        }
    }
};