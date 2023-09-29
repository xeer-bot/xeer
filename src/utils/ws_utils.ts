import { Client, User } from "discord.js";

export async function cnfCache(cache: any, aToken: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
        if (aToken) {
            if (!cache[aToken]) {
                await fetch("https://discord.com/api/users/@me", {
                    headers: {
                        authorization: aToken
                    }
                })      
                    .then(res => res.json())
                    .then(res => {
                        if (res.message == "401: Unauthorized") reject("Unauthorized");
                        cache[aToken] = res.id
                        resolve(cache);
                }).catch(e => { reject(e); });
                reject();
            } else resolve(cache);
        }
    });
}

export async function cnrDU(bot: Client, uID: string): Promise<User> {
    return new Promise(async (resolve, reject) => {
        const cUser = bot.users.cache.get(uID);
        resolve(cUser ?? await bot.users.fetch(uID));
    });
}