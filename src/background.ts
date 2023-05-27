import KeyPressEvent = JQuery.KeyPressEvent;

export interface BracketPair {
	readonly l: string;
	readonly r: string;
}

const bracketPairs: BracketPair[] = [
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
			const index: number = bracketPairs.map((pair: BracketPair): string => pair.l).indexOf(e.key);
			if (index !== -1) {
				e.preventDefault();
				setSelectedTextForInput(element, bracketPairs[index]);
			}
		}
	});

	$(document).on('keypress', '[contenteditable]', function (e: KeyPressEvent<Document, undefined, HTMLElement, HTMLElement>) {
		const element: HTMLElement = e.currentTarget;
		const selectedText = getSelectedTextForContentEditable(element);
		if (selectedText) {
			const index: number = bracketPairs.map((pair: BracketPair): string => pair.l).indexOf(e.key);
			if (index !== -1) {
				const selector: HTMLElement | undefined = $(document).find(`*:contains('${selectedText}'):not(:has(*))`).get()[0];
				if (!selector) {
					return;
				}
				e.preventDefault();
				setSelectedTextForContentEditable(selector, bracketPairs[index]);
			}
		}
	});

	function getSelectionRange(): Range | undefined {
		return window.getSelection()?.getRangeAt(0);
	}

	function setSelectedTextForContentEditable(input: HTMLElement, bracketPair: BracketPair): void {
		const selection: Selection | null = window.getSelection();

		if (selection) {
			const range: Range = selection.getRangeAt(0);
			const selectedText: string = range.toString();

			const fragment: DocumentFragment = document.createDocumentFragment();
			const wrapperNode: HTMLElement = document.createElement('span');
			wrapperNode.textContent = bracketPair.l + selectedText + bracketPair.r;
			fragment.appendChild(wrapperNode);

			range.deleteContents();
			range.insertNode(fragment);

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
		return element.innerText.substring(start, end);
	}

	function setSelectedTextForInput(input: HTMLInputElement | HTMLTextAreaElement, bracketPair: BracketPair): void {
		const start: number | null = input.selectionStart;
		const end: number | null = input.selectionEnd;
		if (start !== null && end !== null) {
			const originalText: string = input.value;
			const selectedText: string = originalText.substring(start, end);
			input.value = originalText.substring(0, start) + bracketPair.l + selectedText + bracketPair.r + originalText.substring(end);
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
