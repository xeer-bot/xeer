import type { CommandInteraction } from "discord.js";
import { Discord, Slash, Client, Guard } from "discordx";
import { executedRecently, prisma } from "../../main.js";
import { colors, errEmbed } from "../../utils/embeds.js";

@Discord()
export class WorkCommand {
    @Slash({ name: "work", description: "Economy : Work" })
    async execute(interaction: CommandInteraction, bot: Client): Promise<void> {
        await interaction.deferReply();
        if (!executedRecently.has(interaction.user.id)) {
            const messages = [
                "did your chores",
                "walked someone's dog",
                "washed a car",
                "worked in an office",
                "worked in a zoo",
                "was developing a game",
                "was building a house",
            ]
            const now = new Date();
            const client = prisma;
            const user = await client.user.findFirst({ where: {
                id: interaction.user.id
            } });
            if (user) {
                const index = Math.floor(Math.random()*messages.length);
                const rCash = Math.floor(Math.random()*index*5);
                await interaction.followUp({
                    embeds: [{
                        title: ":construction_worker: Work",
                        description: `You ${messages[index]} and got $${rCash}!`,
                        color: colors.yellow,
                        timestamp: now.toISOString()
                    }]
                });
                await client.user.update({
                    data: {
                        cash: (user.cash || 0) + rCash
                    },
                    where: {
                        id: interaction.user.id
                    }
                })
            } else {
                await interaction.followUp({ embeds: [ errEmbed(new Error(), "No account found in the database!\nTry again!") ] });
                await client.user.create({ data: {
                    id: interaction.user.id,
                    cash: 0
                } });
            }
            executedRecently.add(interaction.user.id);
            setTimeout(() => {
                executedRecently.delete(interaction.user.id);
            }, 30000);
        } else await interaction.followUp({ embeds: [ errEmbed(new Error(), "Try again in `30 seconds`!")] });
    }
}
