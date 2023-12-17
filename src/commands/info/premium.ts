import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { getTranslated } from "../../languages/helper.js";
import { prisma } from "../../main.js";
import { userAccountThing } from "../../utils/database.js";
import { checkDev } from "../../guards/devOnly.js";

export default {
    data: new SlashCommandBuilder()
        .setName("premium")
        .setDescription("This command checks if you have premium.")
        .addSubcommand((subcommand) => subcommand.setName("check").setDescription("This command checks if you have premium"))
        .addSubcommand((subcommand) => subcommand.setName("grant").setDescription("This command grants premium.").addUserOption(option => option.setName("user").setDescription("Member that you want to grant the premium.").setRequired(true))),
    async execute(interaction: ChatInputCommandInteraction) {
        if (interaction.options.getSubcommand() == "check") {
            await interaction.deferReply();
            const user = await userAccountThing(interaction.user.id);
            if (!user) return;
            if (user.premium) {
                await interaction.followUp({ embeds: [await getTranslated(user.language, "embeds", "premium_active")] });
            } else {
                await interaction.followUp({ embeds: [await getTranslated(user.language, "embeds", "premium_not_active")] });
            }
            return;
        } else if (interaction.options.getSubcommand() == "grant") {
            await interaction.deferReply();
            if (!checkDev(interaction)) return;
            const user_to_grant = interaction.options.getUser("user");
            if (!user_to_grant) { throw new Error("User is undefined."); }
            const user = await userAccountThing(user_to_grant.id);
            if (!user) { throw new Error("User is undefined."); }
            await prisma.user.update({
                where: {
                    id: user_to_grant.id,
                },
                data: {
                    premium: true
                }
            });
            await interaction.followUp({
                embeds: [await getTranslated("en_us", "embeds", "success")],
            });
        }
    }
};