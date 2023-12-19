import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { format, getTranslated } from "../../languages/helper.js";
import { prisma } from "../../main.js";
import { userAccountThing } from "../../utils/database.js";
import { checkDev } from "../../guards/devOnly.js";

export default {
    data: new SlashCommandBuilder()
        .setName("modifybalance")
        .setDescription("This command modifies people's balance.")
        .addSubcommand((subcommand) => 
            subcommand
            .setName("set")
            .setDescription("No description.")
            .addUserOption(option => 
                option.setName("user")
                .setRequired(true)
                .setDescription("No description.")
            )
            .addNumberOption(option => 
                option.setName("newbalance")
                .setDescription("No description.")
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) => 
            subcommand
            .setName("get")
            .setDescription("No description.")
            .addUserOption(option => 
                option.setName("user")
                .setRequired(true)
                .setDescription("No description.")
            )
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        if (!(await checkDev(interaction))) return;
        if (interaction.options.getSubcommand() == "set") {
            const iuserr = interaction.options.getUser("user");
            const cash = interaction.options.getNumber("newbalance");
            if (!cash) throw new Error("Cash is undefined.");
            const iuser = iuserr || interaction.user;
            const user = await userAccountThing(interaction.user.id);
            if (!user) return;
            await prisma.user.update({
                where: {
                    id: iuser.id,
                },
                data: {
                    cash: cash,
                },
            });
            await interaction.followUp({
                embeds: [await getTranslated("en_us", "embeds", "success")],
            });
        } else {
            const iuserr = interaction.options.getUser("user");
            const iuser = iuserr || interaction.user;
            const user = await prisma.user.findUnique({
                where: {
                    id: iuser.id,
                },
            });
            if (user) {
                await interaction.followUp({
                    embeds: [JSON.parse(format(JSON.stringify(await getTranslated("en_us", "embeds", "user_balance")), iuser.id || interaction.user.id, user.cash))],
                });
            } else {
                throw new Error("No account found in database, try again!");
                await prisma.user.create({
                    data: {
                        id: iuser.id,
                        cash: 0,
                    },
                });
            }
        }
    }
};