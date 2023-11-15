export function wrapText(context: any, text: string, x: number, y: number, maxCharacters: number, lineHeight: number) {
	const pattern = `.{1,${maxCharacters}}`
	const regex = new RegExp(pattern, "g");
    const array = text.match(regex) || [];
	let nextY = y;
	for (let i = 0; i < array.length; i++) {
		if (i != array.length-1) {
			array[i] += "-";
		}
		context.fillText(array[i], x, nextY);
		nextY += lineHeight;
	};
}