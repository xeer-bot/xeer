"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colorette_1 = require("colorette");
function getTime() {
    const now = new Date();
    return now.toLocaleTimeString();
}
function info(msg) {
    const time = getTime();
    console.log(` ${(0, colorette_1.blue)(time)} ${(0, colorette_1.blackBright)("|")} ${(0, colorette_1.blue)((0, colorette_1.bold)("INFO"))} ${(0, colorette_1.blackBright)(">")}`, msg);
}
function success(msg) {
    const time = getTime();
    console.log(` ${(0, colorette_1.green)(time)} ${(0, colorette_1.blackBright)("|")} ${(0, colorette_1.green)((0, colorette_1.bold)("INFO"))} ${(0, colorette_1.blackBright)(">")}`, msg);
}
function warn(msg) {
    const time = getTime();
    console.log(` ${(0, colorette_1.yellow)(time)} ${(0, colorette_1.blackBright)("|")} ${(0, colorette_1.yellow)((0, colorette_1.bold)("WARN"))} ${(0, colorette_1.blackBright)(">")}`, msg);
}
function error(msg) {
    const time = getTime();
    console.log(` ${(0, colorette_1.red)(time)} ${(0, colorette_1.blackBright)("|")} ${(0, colorette_1.red)((0, colorette_1.bold)("ERROR"))} ${(0, colorette_1.blackBright)(">")}`, msg);
}
exports.default = { info, warn, error, success };
