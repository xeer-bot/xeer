# Self-hosting
If you want to use the dashboard (SOON) then change `config.json-example`'s filename to `config.json` and fill it.
- Rename `example.env` file to `.env` (If you want a bot token sit in there then add a `BOT_TOKEN="* THE BOT TOKEN *"` line to the file).
- Set `BOT_TOKEN` environment variable to your application bot token. 
- Run `npm i` in the src directory, start using `npm run dev`, execute `/balance` command on the guild where you added the bot and restart the bot.
- (OPTIONAL) If you want bot-owner only commands to work, then change the `ownerID` variable in the `botconfig.json` file to your user id.
