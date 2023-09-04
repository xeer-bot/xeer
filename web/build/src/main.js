"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_json_1 = __importDefault(require("../config.json"));
const logger_1 = __importDefault(require("./utils/logger"));
const path_1 = __importDefault(require("path"));
const authorize_1 = require("./routers/authorize");
const express_session_1 = __importDefault(require("express-session"));
const app = (0, express_1.default)();
app.use(authorize_1.router);
app.use((0, express_session_1.default)({ secret: "secret", resave: false, saveUninitialized: true }));
app.set("view engine", "ejs");
app.set("views", path_1.default.join(__dirname, "render"));
app.get("/dashboard/", (req, res) => {
});
app.listen(config_json_1.default.port, () => {
    logger_1.default.success(`Listening on ${config_json_1.default.port}! :3`);
});
