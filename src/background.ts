import KeyPressEvent = JQuery.KeyPressEvent;

export interface ParenthesisPair {
	readonly l: string;
	readonly r: string;
}

const parentheses: ParenthesisPair[] = [
	{l: '(', r: ')'},
	{l: '{', r: '}'},
	{l: '<', r: '>'},
	{l: '[', r: ']'},
	{l: '\'', r: '\''},
	{l: '"', r: '"'},
	{l: '`', r: '`'}
];

if ($ !== undefined) {
	$(document).on('keypress', 'input, textarea', (e: KeyPressEvent<Document, undefined, HTMLInputElement | HTMLTextAreaElement, HTMLInputElement | HTMLTextAreaElement>): void => {
		const element: HTMLInputElement | HTMLTextAreaElement = e.currentTarget;
		const selectedText: string = getSelectedTextForInput(element);
		if (selectedText) {
			const index: number = parentheses.map((parenthesis: ParenthesisPair): string => parenthesis.l).indexOf(e.key);
			if (index !== -1) {
				e.preventDefault();
				setSelectedTextForInput(element, parentheses[index]);
			}
		}
	});

	$(document).on('keypress', '[contenteditable]', function (e: KeyPressEvent<Document, undefined, HTMLElement, HTMLElement>) {
		const element: HTMLElement = e.currentTarget;
		const selectedTextForContentEditable = getSelectedTextForContentEditable(element);
		if (selectedTextForContentEditable) {
			const number: number = parentheses.map(p => p.l).indexOf(e.key);
			if (number !== -1) {
				const selector: HTMLElement | undefined = $(document).find(`*:contains('${selectedTextForContentEditable}'):not(:has(*))`).get()[0];
				console.log(selector);
				if (!selector) {
					return;
				}
				e.preventDefault();
				setSelectedTextForContentEditable(selector, parentheses[number]);
			}
		}
	});

	function getSelectionRange(): Range | undefined {
		return window.getSelection()?.getRangeAt(0);
	}

	function setSelectedTextForContentEditable(input: HTMLElement, parenthesesPair: ParenthesisPair): void {
		const selection = window.getSelection();

		if (selection) {
			const range = selection.getRangeAt(0);
			const selectedText = range.toString();
			const wrappedText = parenthesesPair.l + selectedText + parenthesesPair.r;

			// Create a document fragment to hold the modified content
			const fragment = document.createDocumentFragment();
			const wrapperNode = document.createElement('span');
			wrapperNode.textContent = wrappedText;
			fragment.appendChild(wrapperNode);

			// Replace the selected range with the modified content
			range.deleteContents();
			range.insertNode(fragment);

			// Restore the selection
			range.setStartAfter(wrapperNode.firstChild as Node);
			range.setEndAfter(wrapperNode.lastChild as Node);
			selection.removeAllRanges();
			selection.addRange(range);
		}
	}

	function getSelectedTextForContentEditable(element: HTMLElement): string {
		const range: Range | undefined = getSelectionRange();
		if (!range || range.startContainer !== range.endContainer) {
			return '';
		}
		const start: number = range.startOffset;
		const end: number = range.endOffset;
		console.log("SURROUND-IT", start, end);
		return element.innerText.substring(start, end);
	}

	function setSelectedTextForInput(input: HTMLInputElement | HTMLTextAreaElement, parenthesesPair: ParenthesisPair): void {
		const start: number | null = input.selectionStart;
		const end: number | null = input.selectionEnd;
		if (start !== null && end !== null) {
			const originalText = input.value;
			const selectedText = originalText.substring(start, end);

			input.value = originalText.substring(0, start) + parenthesesPair.l + selectedText + parenthesesPair.r + originalText.substring(end);

			input.setSelectionRange(start + 1, end + 1);
		}
	}

	function getSelectedTextForInput(input: HTMLInputElement | HTMLTextAreaElement): string {
		const start: number | null = input.selectionStart;
		const end: number | null = input.selectionEnd;
		if (start === null || end === null) {
			return '';
		}
		return input.value.substring(start, end);
	}
}
