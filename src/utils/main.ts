export function title() {
    console.log("██╗  ██╗███████╗███████╗██████╗ \n╚██╗██╔╝██╔════╝██╔════╝██╔══██╗\n ╚███╔╝ █████╗  █████╗  ██████╔╝\n ██╔██╗ ██╔══╝  ██╔══╝  ██╔══██╗\n██╔╝ ██╗███████╗███████╗██║  ██║\n╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝");
    console.log("Loading...");
    console.log();
    if (process.platform == 'win32') {
		process.title = "xeer";
	} else {
		process.stdout.write('\x1b]2;' + "xeer" + '\x1b\x5c');
	}
}