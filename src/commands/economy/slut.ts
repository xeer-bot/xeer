import type { CommandInteraction } from "discord.js";
import { Discord, Slash, Client, Guard } from "discordx";
import { executedRecently, prisma } from "../../main.js";
import { colors, errEmbed } from "../../utils/embeds.js";
import { userAccountThing } from "../../utils/database.js";

@Discord()
export class SlutCommand {
    @Slash({ name: "slut", description: "Economy : Slut" })
    async execute(interaction: CommandInteraction, bot: Client): Promise<void> {
        await interaction.deferReply();
        if (!executedRecently.has(interaction.user.id)) {
            const messages = [
                "were a man prostitute",
                "were a prostitute",
                "were an underaged prostitute",
                "were hacking a darkweb website",
                "were nuking tiktok's server",
                "were hacking a bank",
                "were hacking FBI",
            ]
            const now = new Date();
            const user = await userAccountThing(interaction.user.id);
            if (!user) return;
            const index = Math.floor(Math.random()*messages.length);
            const rCash = Math.floor(Math.random()*(index*10));
            await interaction.followUp({
                embeds: [{
                    title: ":poop: Slut",
                    description: `You ${messages[index]} and got $${rCash}!`,
                    color: colors.yellow,
                    timestamp: now.toISOString()
                }]
            });
            await prisma.user.update({
                data: {
                    cash: (user.cash || 0) + rCash
                },
                where: {
                    id: interaction.user.id
                }
            })
            executedRecently.add(interaction.user.id+"-slut");
            setTimeout(() => {
                executedRecently.delete(interaction.user.id+"-slut");
            }, 300000);
        } else await interaction.followUp({ embeds: [ errEmbed(new Error(), "Try again in `5 minutes`!")] });
    }
}
