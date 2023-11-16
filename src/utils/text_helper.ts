export function wrapTextAlternative(context: any, text: string, x: number, y: number, maxCharacters: number, lineHeight: number) {
	const pattern = `.{1,${maxCharacters}}`
	const regex = new RegExp(pattern, "g");
    const array = text.match(regex) || [];
	let nextY = y;
	for (let i = 0; i < array.length; i++) {
		if (i != array.length-1 && !array[i].endsWith(".") || !array[i].endsWith(" ") || !array[i].endsWith(",") || !array[i].endsWith("!")) {
			array[i] += "-";
		}
		context.fillText(array[i], x, nextY);
		nextY += lineHeight;
	};
}

export function wrapText(context: any, text: string, x: number, y: number, maxCharacters: number, lineHeight: number) {
	let words = text.split(" ");
	let finalSentences = [];
	let currentSentenceIndex = 0;
	let currentSentence = "";
	words.forEach(word => {
		if (currentSentence.length + word.length < maxCharacters) {
			currentSentence += word + " ";
		} else {
			finalSentences[currentSentenceIndex] = currentSentence;
			currentSentenceIndex += 1;
			currentSentence = word + " ";
		}
	});
	finalSentences[currentSentenceIndex] = currentSentence;
	let nextY = y;
	finalSentences.forEach(sentence => {
		context.fillText(sentence, x, nextY);
		nextY += lineHeight;
	})
}