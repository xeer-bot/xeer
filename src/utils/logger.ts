import { green, blue, yellow, red, bold, blackBright } from "colorette";

function getTime() {
    const now = new Date();
    return now.toLocaleTimeString();
}

export function info(msg: any) {
    const time = getTime();
    console.log(` ${blue(time)} ${blackBright("|")} ${blue(bold("INFO"))} ${blackBright(">")}`, msg);
}

export function success(msg: any) {
    const time = getTime();
    console.log(` ${green(time)} ${blackBright("|")} ${green(bold("INFO"))} ${blackBright(">")}`, msg);
}

export function warn(msg: any) {
    const time = getTime();
    console.log(` ${yellow(time)} ${blackBright("|")} ${yellow(bold("WARN"))} ${blackBright(">")}`, msg);
}

export function error(msg: any) {
    const time = getTime();
    console.log(` ${red(time)} ${blackBright("|")} ${red(bold("ERROR"))} ${blackBright(">")}`, msg);
}
