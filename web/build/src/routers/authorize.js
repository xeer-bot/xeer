"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
exports.router = express_1.default.Router();
const config_json_1 = __importDefault(require("../../config.json"));
exports.router.get("/user/authorize", (req, res) => {
    const { code } = req.query;
    if (code) {
        fetch("https://discord.com/api/oauth2/token", {
            method: "POST",
            body: new URLSearchParams({
                client_id: config_json_1.default.oauth2.client_id,
                client_secret: config_json_1.default.oauth2.client_secret,
                code: code.toString(),
                grant_type: "authorization_code",
                redirect_uri: config_json_1.default.domain + "/user/authorize" || `http://localhost:${config_json_1.default.port}/user/authorize`,
                scope: "identify"
            }).toString(),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(data => data.json()).then(data => {
            console.log(data);
            req.session.token = `${data.token_type} ${data.access_token}`;
            req.session.save((err) => {
                if (err) {
                    console.log(err);
                    res.redirect("/");
                }
            });
            res.render("dashboard");
        }).catch(err => {
            console.log(err);
            res.redirect("/");
        });
    }
    else
        res.redirect("/");
});
