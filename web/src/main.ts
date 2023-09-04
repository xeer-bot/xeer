import express from "express";
import config from "../config.json";
import logger from "./utils/logger";
import path from "path"
import { isLoggedIn, router } from "./routers/authorize";
import session from "express-session";
import fs from "fs";

const app = express();

app.use(router);
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
app.use("/assets/", express.static(path.join(__dirname, "/render/assets")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "render"));

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/dashboard/:tab", isLoggedIn, (req, res) => {
    const tab = req.query.tab;
    const token = req.session.token;
    if (tab && fs.existsSync(path.join(__dirname, `/render/tabs/${tab}.ejs`))) {
        res.render(`./tabs/${tab.toString()}`, {"token": token});
    } else {
        res.render("./tabs/welcomeback", { "token": token });
    }
});

app.get("/dashboard/", isLoggedIn, (req, res) => {
    const token = req.session.token;
    res.render("./tabs/welcomeback", { "token": token });
})

app.get("/add", (req, res) => {
    res.redirect(config.bot.invite_link);
})

app.listen(config.port, () => {
    logger.success(`Listening on ${config.port}! :3`);
});