const fs = require("fs");
const cp = require("child_process");

const files = ["build_date.txt", ".env"];
const folders = ["./src/languages/custom/", "./src/languages/embeds", "./src/languages/messages", "./prisma"]

console.log("Running...");

cp.exec("npx tsc", (err, stdout, stderr) => {
    const dateRaw = new Date();
    if (err) {
        throw err;
    }
    const date = dateRaw.toISOString();
    fs.writeFile("build_date.txt", date, (err) => {
        if (err) {
            throw err;
        }
        console.log(`Build Done! Date ISO String: ${date}`);
    });

    setTimeout(() => {
        console.log("Copying files...");
        files.forEach((file) => {
            console.log(`Copying file ${file}...`);
            fs.copyFileSync(file, `build/${file}`);
            console.log(`Copying file ${file} done!`);
        });

        console.log("Copying folders...");
        folders.forEach((folder) => {
            console.log(`Copying folder ${folder}...`);
            fs.cpSync(folder, `build/${folder}`, { recursive: true });
            console.log(`Copying file ${folder} done!`);
        });

        setTimeout(() => {
            console.log("Done! Exitting...");
            process.exit();
        }, 1000);
    }, 1000);
});
