import KeyPressEvent = JQuery.KeyPressEvent;
import {runWithActive} from './storage';

interface BracketPair {
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
				e.originalEvent?.preventDefault();
				runWithActive((): void => {
					setSelectedTextForInput(element, bracketPairs[index]);
				}, () => {
					insertTextForInput(element, e.key);
				});
			}
		}
	});

	$(document).on('keypress', '[contenteditable]', (e: KeyPressEvent<Document, undefined, HTMLElement, HTMLElement>): void => {
		const element: HTMLElement = e.currentTarget;
		const selectedText: string = getSelectedTextForContentEditable(element);
		if (selectedText) {
			const index: number = bracketPairs.map((pair: BracketPair): string => pair.l).indexOf(e.key);
			if (index !== -1) {
				const selector: HTMLElement | undefined = $(element).find(`*:contains('${selectedText}'):not(:has(*))`).get()[0];
				if (!selector) {
					return;
				}
				e.originalEvent?.preventDefault();
				runWithActive((): void => {
					setSelectedTextForContentEditable(bracketPairs[index]);
				}, () => {
					insertTextForContentEditable(e.key);
				});
			}
		}
	});

	function getSelectionRange(): Range | undefined {
		return window.getSelection()?.getRangeAt(0);
	}

	function setSelectedTextForContentEditable(bracketPair: BracketPair): void {
		const selection: Selection | null = window.getSelection();

		if (selection) {
			const range: Range = selection.getRangeAt(0);
			const selectedText: string = range.toString();

			range.deleteContents();
			const textNode: Text = document.createTextNode(bracketPair.l + selectedText + bracketPair.r);
			range.insertNode(textNode);

			const inputEvent = new InputEvent('input', {
				data: textNode.textContent,
				inputType: 'insertText',
				bubbles: true,
				cancelable: true,
				composed: true
			});

			range.startContainer.parentElement?.dispatchEvent(inputEvent);

			const newRange = document.createRange();
			newRange.setStart(textNode, 1);
			newRange.setEnd(textNode, selectedText.length + 1);
			selection.removeAllRanges();
			selection.addRange(newRange);
		}
	}

	function insertTextForContentEditable(text: string): void {
		// Pobieramy aktualne zaznaczenie
		const selection = window.getSelection();

		if (selection && selection.rangeCount > 0) {
			// Pobieramy bieżący zakres (Range)
			const range = selection.getRangeAt(0);

			// Tworzymy nowy węzeł tekstowy z tekstem, który chcemy wstawić
			const textNode = document.createTextNode(text);

			// Wstawiamy tekst w miejscu zaznaczenia
			range.deleteContents(); // Usuwamy zaznaczenie
			range.insertNode(textNode); // Wstawiamy nowy tekst

			// Ustawiamy kursor po wstawionym tekście (po węźle tekstowym)
			range.setStartAfter(textNode);
			range.setEndAfter(textNode);

			// Przenosimy kursor po wstawionym tekście
			selection.removeAllRanges();
			selection.addRange(range);
		}
	}

	function insertTextForInput(element: HTMLInputElement | HTMLTextAreaElement, text: string): void {
		debugger;
		console.log('NOW');
		const startPos: number = element.selectionStart ?? 0;
		const endPos: number = element.selectionEnd ?? (element.textContent?.length ?? 0) - 1;
		element.setRangeText(text, startPos, endPos, 'end');
		element.selectionStart = element.selectionEnd = startPos + text.length;
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
