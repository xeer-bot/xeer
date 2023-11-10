import { colors } from "../../utils/embeds.js";

const now = new Date();

export default {
    success: {
        title: `${emojis.success} Success!`,
        description: `Operation completed successfully!`,
        color: colors.green,
        timestamp: now.toISOString(),
    },
    // MODERATION
    user_banned: {
        title: ":hammer: Banhammer",
        description: `${member} was been banned!\nReason: ${reason}`,
        color: colors.green,
        timestamp: now.toISOString(),
    },
    got_banned: {
        title: ":hammer: Banhammer",
        description: `You got banned from ${interaction.guild?.name}!\nReason: ${reason}`,
        color: colors.red,
        timestamp: now.toISOString(),
    },
    user_kicked: {
        title: ":hammer: Kickhammer",
        description: `${member} was been kicked!\nReason: ${reason}`,
        color: colors.green,
        timestamp: now.toISOString(),
    },
    got_kicked: {
        title: ":hammer: Kickhammer",
        description: `You got kicked from ${interaction.guild?.name}!\nReason: ${reason}`,
        color: colors.red,
        timestamp: now.toISOString(),
    },
    deleted_msgs: {
        title: `${emojis.success} Success!`,
        description: `Deleted ${amount} messages!`,
        color: colors.green,
        footer: {
            text: `Action requested by ${interaction.user.username}`,
        },
        timestamp: now.toISOString(),
    },
    user_unbanned: {
        title: ":hammer: Unbanhammer",
        description: `<@${member}> was been unbanned!`,
        color: colors.green,
        timestamp: now.toISOString(),
    },
    // ECONOMY
    user_balance: {
        title: ":money_with_wings: Balance",
        description: `<@${interaction.user.id}>'s Balance: $${user.cash}`,
        color: colors.green,
        timestamp: now.toISOString(),
    },
    crime_success: {
        title: ":smiling_imp: Crime",
        description: `You ${messages[index]} and got $${rCash}!`,
        color: colors.purple,
        timestamp: now.toISOString(),
    },
    leaderboard: {
        title: ":money_with_wings: Leaderboard",
        description: leaderboard,
        color: colors.green,
        timestamp: now.toISOString(),
    },
    work: {
        title: ":construction_worker: Work",
        description: `You ${messages[index]} and got $${rCash}!`,
        color: colors.yellow,
        timestamp: now.toISOString(),
    },
    // FUN
    cat: {
        title: ":cat: Random cat.",
        description: `Random cat.`,
        image: {
            url: `https://cataas.com/cat`,
        },
        color: colors.yellow,
        timestamp: now.toISOString(),
    },
    cat_gif: {
        title: ":cat: Random cat.",
        description: `Random cat gif.`,
        image: {
            url: `https://cataas.com/cat/gif`,
        },
        color: colors.yellow,
        timestamp: now.toISOString(),
    },
    cat_says: {
        title: ":cat: Cat.",
        description: `Cat says: ${text}`,
        image: {
            url: `https://cataas.com/cat/says/${encodeURIComponent(text)}`,
        },
        color: colors.yellow,
        timestamp: now.toISOString(),
    },
};
