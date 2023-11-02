export const colors = {
    primary: 0x2b2d31,
    red: 0xff0000,
    green: 0x15ff00,
    blue: 0x0011ff,
    yellow: 0xffff00,
    purple: 0x8c00ff,
};

export const emojis = {
    success: ":white_check_mark:",
    error: ":x:",
};

export function errEmbed(err: Error, text: string | undefined) {
    const now = new Date();
    const textF = text ? text : `An error occured!\n\`\`\`${err.message}\`\`\``;
    return {
        title: `${emojis.error} Error!`,
        description: `${textF}`,
        color: colors.red,
        timestamp: now.toISOString(),
    };
}

export function npEmbed(text: string | undefined, permission: string | undefined) {
    const now = new Date();
    const textF = text ? text : `You don't have ${permission ? `\`${permission}\`` : "enough"} permission(s)!`;
    return {
        title: `${emojis.error} No permission!`,
        description: `${textF}`,
        color: colors.red,
        timestamp: now.toISOString(),
    };
}

export function noBotPermsEmbedBUK(permission: string) {
    const now = new Date();
    const textF = `An error occured. Common causes:\n- The bot has no \`${permission}\` permission.\n- The punished highest role's position is higher than bot's role position.\n- The punished is already banned or unbanned (only if using ban/unban)`;
    return {
        title: `${emojis.error} Error!`,
        description: `${textF}`,
        color: colors.red,
        timestamp: now.toISOString(),
    };
}
