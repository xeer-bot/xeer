import { Client, User } from "discord.js";
import { setCache } from "../http/server.js";

export async function cnfCache(cache: any, aToken: string): Promise<any> {
    return new Promise((resolve, reject) => {
        if (!cache[aToken]) {
            fetch("https://discord.com/api/users/@me", {
                headers: {
                    authorization: aToken,
                },
            })
                .then((res) => res.json())
                .then((res) => {
                    if (res.message == "401: Unauthorized") reject("Unauthorized");
                    cache[aToken] = res.id;
                    setCache(cache);
                    resolve(cache);
                })
                .catch((e) => {
                    reject("Something unexpected happened!");
                });
        } else resolve(cache);
    });
}

export async function hasAdministrator(bot: Client, gID: string, uID: string): Promise<boolean> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
        const g = bot.guilds.cache.get(gID);
        if (g) {
            resolve((await g.members.fetch(uID)).permissions.has("Administrator") ?? false);
        }
        return resolve(false);
    });
}

export async function cnrDU(bot: Client, uID: string): Promise<User> {
    return new Promise((resolve, reject) => {
        const cUser = bot.users.cache.get(uID);
        if (!cUser) {
            bot.users
                .fetch(uID)
                .then((d) => resolve(d))
                .catch((e) => reject("Something unexpected happened!"));
        } else return cUser;
    });
}
