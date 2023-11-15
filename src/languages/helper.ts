// https://stackoverflow.com/a/15327425
export function format(fmt: string, ...args: any) {
    return fmt.split("%%").reduce((aggregate, chunk, i) => aggregate + chunk + (args[i] || ""), "");
}

const langFiles: any = [];

export async function getTranslated(language: string, type: string, property: string): Promise<any> {
    if (langFiles[`${type}/${language}`]) {
        const phase1 = langFiles[`${type}/${language}`];
        return phase1[property];
    } else {
        const phase1 = await import(`./${type}/${language}.js`);
        langFiles[`${type}/${language}`] = phase1.default;
        return phase1.default[property];
    }
}
