import { Client, User } from "discord.js";

export async function cnfCache(cache: any, aToken: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
        if (!cache[aToken]) {
            fetch("https://discord.com/api/users/@me", {
                headers: {
                    authorization: aToken
                }
            })      
                .then(res => res.json())
                .then(res => {
                    if (res.message == "401: Unauthorized") reject("Unauthorized");
                    cache[aToken] = res.id
                    resolve(cache);
            }).catch(e => { reject("Something unexpected happened!"); });
        } else resolve(cache);
    });
}

export function hasAdministrator(bot: Client, gID: string, uID: string): boolean {
    return bot.guilds.cache.get(gID)?.members.cache.get(uID)?.permissions.has("Administrator") ?? false;
}

export async function cnrDU(bot: Client, uID: string): Promise<User> {
    return new Promise(async (resolve, reject) => {
        const cUser = bot.users.cache.get(uID);
        if (!cUser) {
            bot.users.fetch(uID).then(d => resolve(d)).catch(e => reject("Something unexpected happened!"));
        } else return cUser;
    });
}