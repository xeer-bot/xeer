// Yo! If you are looking here then... Have a good day! :3

async function getDiscordUser(token) {
	return new Promise(async (resolve, reject) => {
		fetch('https://discord.com/api/users/@me', {
			headers: {
				authorization: token,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				resolve(data);
			})
			.catch((err) => reject(err));
	});
}

async function getDiscordUserGuilds(token) {
	return new Promise(async (resolve, reject) => {
		fetch('https://discord.com/api/users/@me/guilds', {
			headers: {
				authorization: token,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				resolve(data);
			})
			.catch((err) => reject(err));
	});
}

async function getDiscordUserGIDs(token) {
	return new Promise(async (resolve, reject) => {
		fetch('https://discord.com/api/users/@me/guilds', {
			headers: {
				authorization: token,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				let dAlt = [];
				data.forEach((obj) => {
					dAlt.push(obj.id);
				});
				resolve(dAlt);
			})
			.catch((err) => reject(err));
	});
}
