import { ApplicationCommandOptionType, CommandInteraction, User } from "discord.js";
import { Discord, Guard, Slash, SlashGroup, SlashOption } from "discordx";
import { userAccountThing } from "../../utils/database.js";
import { getTranslated } from "../../languages/helper.js";
import { BotOwnerOnly } from "../../guards/devOnly.js";
import { prisma } from "../../main.js";

@Discord()
@SlashGroup({
    name: "premium",
    description: "This command checks if you have premium."
})
@SlashGroup("premium")
export class PremiumCommand {
    @Slash({
        description: "This checks if you have premium."
    })
    async check(
        interaction: CommandInteraction
    ): Promise<void> {
        await interaction.deferReply();
        const user = await userAccountThing(interaction.user.id);
        if (!user) return;
        if (user.premium) {
            await interaction.followUp({ embeds: [await getTranslated(user.language, "embeds", "premium_active")] });
        } else {
            await interaction.followUp({ embeds: [await getTranslated(user.language, "embeds", "premium_not_active")] });
        }
    }
    @Slash({
        description: "This grants premium."
    })
    @Guard(BotOwnerOnly)
    async grant(
        @SlashOption({
            name: "user",
            description: "User",
            required: true,
            type: ApplicationCommandOptionType.User,
        })
        user_to_grant: User,
        interaction: CommandInteraction
    ): Promise<void> {
        await interaction.deferReply();
        const user = await userAccountThing(user_to_grant.id);
        if (!user) return;
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
    @Slash({
        description: "This takes premium."
    })
    @Guard(BotOwnerOnly)
    async take(
        @SlashOption({
            name: "user",
            description: "User",
            required: true,
            type: ApplicationCommandOptionType.User,
        })
        user_to_grant: User,
        interaction: CommandInteraction
    ): Promise<void> {
        await interaction.deferReply();
        const user = await userAccountThing(user_to_grant.id);
        if (!user) return;
        await prisma.user.update({
            where: {
                id: user_to_grant.id,
            },
            data: {
                premium: false
            }
        });
        await interaction.followUp({
            embeds: [await getTranslated("en_us", "embeds", "success")],
        });
    }
}