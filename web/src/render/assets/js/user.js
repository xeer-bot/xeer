// Yo! If you are looking here then... Have a good day! :3

async function getDiscordUser() {
    return new Promise(async (resolve, reject) => {
        await fetch("https://discord.com/api/users/@me", {
            headers: {
                authorization: "<%= token %>"
            }
        })
            .then(res => res.json())
            .then(data => {
                resolve(data);
            }).catch(err => reject(err));
    });
}