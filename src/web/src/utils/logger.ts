import { green, blue, yellow, red, bold, blackBright } from "colorette";

function getTime() {
    const now = new Date();
    return now.toLocaleTimeString();
}

function info(msg: any, source: (undefined | string) = "undefined") {
    const time = getTime();
    console.log(` ${blue(time)} ${blackBright("|")} ${blue(bold("INFO"))} ${blackBright(">")}`, msg, blackBright("(" + source + ")"));
}

function success(msg: any, source: (undefined | string) = "undefined") {
    const time = getTime();
    console.log(` ${green(time)} ${blackBright("|")} ${green(bold("INFO"))} ${blackBright(">")}`, msg, blackBright("(" + source + ")"));
}

function warn(msg: any, source: (undefined | string) = "undefined") {
    const time = getTime();
    console.log(` ${yellow(time)} ${blackBright("|")} ${yellow(bold("WARN"))} ${blackBright(">")}`, msg, blackBright("(" + source + ")"));
}

function error(msg: any, source: (undefined | string) = "undefined") {
    const time = getTime();
    console.log(` ${red(time)} ${blackBright("|")} ${red(bold("ERROR"))} ${blackBright(">")}`, msg, blackBright("(" + source + ")"));
}

export default {
    info,
    warn,
    error,
    success,
};
