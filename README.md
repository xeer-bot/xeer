# Self-hosting

If you want to use the dashboard then change (in the web folder) `config.json-example`'s filename to `config.json` and fill it.

-   Rename `example.env` file to `.env` (If you want a bot token sit in there then add a `BOT_TOKEN="* THE BOT TOKEN *"` line to the file).
-   Set `BOT_TOKEN` environment variable to your application bot token.
-   Run `npm i` in the terminal and start using `npm run dev`.
-   Run `npx prisma generate` in the terminal.
-   (OPTIONAL) If you want bot-owner only commands to work, then change the `ownerID` variable in the `botconfig.json` file to your user id.
