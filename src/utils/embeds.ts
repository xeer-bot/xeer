export function errEmbed(text: (string|undefined), now: Date) {
    const textF = text ? text : "An error occured!"; 
    return {
        title: "> :x: Error!",
        description: `${textF}`,
        color: 0x2b2d31,
        timestamp: now.toISOString()
    }
}

export function npEmbed(text: (string|undefined), permission: (string|undefined), now: Date) {
    const textF = text ? text : `You don't have ${permission ? `\`${permission}\`` : "enough"} permission(s)!`; 
    return {
        title: "> :x: No permission!",
        description: `${textF}`,
        color: 0x2b2d31,
        timestamp: now.toISOString()
    }
}

export function noBotPermsEmbed(permission: string, now: Date) {
    const textF = `An error occured. Common causes:\n- The bot has no \`${permission}\` permission.\n- The punished highest role's position is higher than bot's role position.`; 
    return {
        title: "> :x: Error!",
        description: `${textF}`,
        color: 0x2b2d31,
        timestamp: now.toISOString()
    }
}