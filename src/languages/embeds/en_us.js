import { colors, emojis } from "../../utils/embeds.js";

const now = new Date();

export default {
    // GENERAL
    success: {
        title: `${emojis.success} Success!`,
        description: "Operation completed successfully!",
        color: colors.green,
        timestamp: now.toISOString(),
    },
    success_alt: {
        title: `${emojis.success} Success!`,
        description: "Operation completed successfully! (Took %%)",
        color: colors.green,
        timestamp: now.toISOString(),
    },
    error: {
        title: `${emojis.error} Error.`,
        description: "An error occured!\n```%%```",
        color: colors.red,
        timestamp: now.toISOString()
    },
    not_a_dev: {
        title: `${emojis.error} No permission.`,
        description: "You're not a dev of this bot.",
        color: colors.red,
        timestamp: now.toISOString()
    },
    cooldown: {
        title: `${emojis.error} Cooldown.`,
        description: "You're on cooldown! Try again in `%%`.",
        color: colors.red,
        timestamp: now.toISOString()
    },
    // MODERATION
    user_banned: {
        title: ":hammer: Banhammer",
        description: "%% was been banned!\nReason: %%",
        color: colors.green,
        timestamp: now.toISOString(),
    },
    got_banned: {
        title: ":hammer: Banhammer",
        description: "You got banned from %%!\nReason: %%",
        color: colors.red,
        timestamp: now.toISOString(),
    },
    user_kicked: {
        title: ":hammer: Kickhammer",
        description: "%% was been kicked!\nReason: %%",
        color: colors.green,
        timestamp: now.toISOString(),
    },
    got_kicked: {
        title: ":hammer: Kickhammer",
        description: "You got kicked from %%!\nReason: %%",
        color: colors.red,
        timestamp: now.toISOString(),
    },
    deleted_msgs: {
        title: `${emojis.success} Success!`,
        description: "Deleted %% messages.",
        color: colors.green,
        footer: {
            text: "Action requested by %%",
        },
        timestamp: now.toISOString(),
    },
    user_unbanned: {
        title: ":hammer: Unbanhammer",
        description: "%% was been unbanned!",
        color: colors.green,
        timestamp: now.toISOString(),
    },
    // ECONOMY
    user_balance: {
        title: ":money_with_wings: Balance",
        description: "<@%%>'s Balance: $%%",
        color: colors.green,
        timestamp: now.toISOString(),
    },
    crime_success: {
        title: ":smiling_imp: Crime",
        description: "You %% and got $%%!",
        color: colors.purple,
        timestamp: now.toISOString(),
    },
    leaderboard: {
        title: ":money_with_wings: Leaderboard",
        description: "%%",
        color: colors.green,
        timestamp: now.toISOString(),
    },
    work: {
        title: ":construction_worker: Work",
        description: "You %% and got $%%!",
        color: colors.yellow,
        timestamp: now.toISOString(),
    },
    gamble_no_money: {
        title: ":smiling_imp: Gamble",
        description: "You don't have that much money!",
        color: colors.purple,
        timestamp: now.toISOString(),
    },
    gamble_lost: {
        title: ":smiling_imp: Gamble",
        description: "You lost all the money you bet!",
        color: colors.purple,
        timestamp: now.toISOString(),
    },
    gamble_won: {
        title: ":smiling_imp: Gamble",
        description: "You won $%%!",
        color: colors.purple,
        timestamp: now.toISOString(),
    },
    // FUN
    cat: {
        title: ":cat: Random cat.",
        description: "Random cat.",
        image: {
            url: "https://cataas.com/cat",
        },
        color: colors.yellow,
        timestamp: now.toISOString(),
    },
    cat_gif: {
        title: ":cat: Random cat.",
        description: "Random cat gif.",
        image: {
            url: "https://cataas.com/cat/gif",
            dynamic: true,
        },
        color: colors.yellow,
        timestamp: now.toISOString(),
    },
    cat_says: {
        title: ":cat: Cat.",
        description: "Cat says: %%",
        image: {
            url: "https://cataas.com/cat/says/%%",
        },
        color: colors.yellow,
        timestamp: now.toISOString(),
    },
    // INFO
    statistics_list: {
        title: ":abacus: Statistics Channels",
        description: "%%If you notice \"Unknown\" channels, do these steps:\n- Run /statistics debug_list\n- Check that channel's ID\n- Remove that channel via /statistics remove_id",
        color: colors.yellow,
        timestamp: now.toISOString(),
    },
    premium_active: {
        title: ":star: Premium",
        description: ":white_check_mark: You have active premium!",
        color: colors.green,
        timestamp: now.toISOString(),
    },
    premium_not_active: {
        title: ":star: Premium",
        description: ":x: You don't have premium!",
        color: colors.red,
        timestamp: now.toISOString(),
    },
};
