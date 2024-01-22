import express from "express";
import config from "../config.json" assert { type: "json" };
import logger from "./utils/logger.js";
import path from "path";
import { isLoggedIn, router } from "./routers/authorize.js";
import session from "express-session";
import fs from "fs";
import { fileURLToPath } from "url";

if (process.platform == "win32") {
    process.title = "xeer";
} else {
    process.stdout.write("\x1b]2;" + "xeer" + "\x1b\x5c");
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(router);
app.use(
    session({
        secret: "secret",
        resave: false,
        saveUninitialized: true,
    })
);
app.use("/assets/", express.static(path.join(__dirname, "/render/assets")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "render"));

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/dashboard/:tab", isLoggedIn, (req, res) => {
    const { tab } = req.params;
    const { gid } = req.query;
    const token = req.session.token;
    if (gid) {
        if (tab && fs.existsSync(path.join(__dirname, `/render/tabs/${tab}.ejs`))) {
            res.render(`./tabs/${tab.toString()}`, {
                token: token,
                guild_id: gid,
                connector_url: config.connector_url,
            });
        } else {
            res.render("./tabs/dashboard", {
                token: token,
                guild_id: "",
                connector_url: config.connector_url,
            });
        }
    } else {
        res.render("./tabs/welcomeback", {
            token: token,
            guild_id: "",
            connector_url: config.connector_url,
        });
    }
});

app.get("/dashboard/", isLoggedIn, (req, res) => {
    const token = req.session.token;
    res.render("./tabs/dashboard", {
        token: token,
        guild_id: "",
        connector_url: config.connector_url,
    });
});

app.get("/ping", async (req, res) => {
    res.send("pong!");
});

app.get("/add", (req, res) => {
    res.redirect(config.bot.invite_link);
});

export async function listenWeb() {
    app.listen(config.port, () => {
        logger.success(`Listening on ${config.port}!`, "Web Server");
    });
}
