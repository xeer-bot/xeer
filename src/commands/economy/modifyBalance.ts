import { SlashCommandStringOption, type CommandInteraction, ApplicationCommandOptionType, PresenceStatusData, User } from "discord.js";
import { Discord, Slash, Client, Guard, SlashOption, SlashChoice, SlashGroup } from "discordx";
import { colors, emojis, errEmbed } from "../../utils/embeds.js";
import { BotOwnerOnly } from "../../guards/devOnly.js";
import { prisma } from "../../main.js";
import { userAccountThing } from "../../utils/database.js";

@Discord()
@SlashGroup({ name: "modifybalance", description: "Modifies balance (Bot Owner only)" })
@SlashGroup("modifybalance")
export class ModifyBalanceCommand {
    @Slash({ description: "Economy : Sets the balance." })
    @Guard(BotOwnerOnly)
    async set(
        @SlashOption({
            name: "newbalance",
            description: "New balance",
            required: true,
            type: ApplicationCommandOptionType.Number
        })
        cash: number,
        @SlashOption({
            name: "user",
            description: "User",
            required: false,
            type: ApplicationCommandOptionType.User
        })
        iuserr: User,
    interaction: CommandInteraction, bot: Client): Promise<void> {
        const now = new Date();
        await interaction.deferReply();
        const iuser = iuserr || interaction.user;
        const user = await userAccountThing(interaction.user.id);
        if (!user) return;
        await prisma.user.update({
            where: {
                id: iuser.id
            },
            data: {
                cash: cash
            }
        })
        await interaction.followUp({
            embeds: [{
                title: `${emojis.success} Success!`,
                description: `Operation completed successfully!`,
                color: colors.green,
                timestamp: now.toISOString()
            }]
        });
    }
    @Slash({ description: "Economy : Clears the balance." })
    @Guard(BotOwnerOnly)
    async clear(
        @SlashOption({
            name: "user",
            description: "User",
            required: false,
            type: ApplicationCommandOptionType.User
        })
        iuserr: User,
    interaction: CommandInteraction, bot: Client): Promise<void> {
        const now = new Date();
        await interaction.deferReply();
        const iuser = iuserr || interaction.user;
        const user = await prisma.user.findUnique({ where: {
            id: iuser.id
        } });
        if (user) {
            await prisma.user.update({
                where: {
                    id: iuser.id
                },
                data: {
                    cash: 0
                }
            })
            await interaction.followUp({
                embeds: [{
                    title: `${emojis.success} Success!`,
                    description: `Operation completed successfully!`,
                    color: colors.green,
                    timestamp: now.toISOString()
                }]
            });
        } else {
            await interaction.followUp({
                embeds: [ errEmbed(new Error(), "No account found in the database!\nTry again!") ]
            });
            await prisma.user.create({ data: {
                id: iuser.id,
                cash: 0
            } });
        }
    }
    @Slash({ description: "Economy : Gets a balance." })
    @Guard(BotOwnerOnly)
    async get(
        @SlashOption({
            name: "user",
            description: "User",
            required: false,
            type: ApplicationCommandOptionType.User
        })
        iuserr: User,
    interaction: CommandInteraction, bot: Client): Promise<void> {
        const now = new Date();
        await interaction.deferReply();
        const iuser = iuserr || interaction.user;
        const user = await prisma.user.findUnique({ where: {
            id: iuser.id
        } });
        if (user) {
            await interaction.followUp({
                embeds: [{
                    title: ":money_with_wings: Balance",
                    description: `<@${iuser.id || interaction.user.id}>'s Balance: $${user.cash}`,
                    color: colors.green,
                    timestamp: now.toISOString()
                }]
            });
        } else {
            await interaction.followUp({
                embeds: [ errEmbed(new Error(), "No account found in the database!\nTry again!") ]
            });
            await prisma.user.create({ data: {
                id: iuser.id,
                cash: 0
            } });
        }
    }
}
