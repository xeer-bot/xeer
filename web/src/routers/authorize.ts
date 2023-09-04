import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
export const router = express.Router();

import config from "../../config.json";

router.use(session({ secret: "secret", resave: false, saveUninitialized: true }))

declare module 'express-session' {
    interface SessionData {
        token: string;
    }
}

router.get("/user/authorize", (req, res) => {
    const { code } = req.query;
    if (code) {
        fetch("https://discord.com/api/oauth2/token", {
            method: "POST",
            body: new URLSearchParams({
                client_id: config.oauth2.client_id,
                client_secret: config.oauth2.client_secret,
                code: code.toString(),
                grant_type: "authorization_code",
                redirect_uri: config.domain + "/user/authorize" || `http://localhost:${config.port}/user/authorize`,
                scope: "identify"
            }).toString(),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(data => data.json()).then(data => {
            if (data.error) { return res.redirect("/") }
            req.session.token = `${data.token_type} ${data.access_token}`;
            req.session.save((err) => {
                if (err) {
                    return res.redirect("/login");
                }
            });
            res.redirect("/dashboard");
        }).catch(err => {
            res.redirect("/login");
        });
    } else res.redirect("/");
});

export function isLoggedIn(req: Request, res: Response, next: NextFunction) {
    if (req.session.token) {
        next();
    } else res.redirect(config.oauth2.authorize_link);
}