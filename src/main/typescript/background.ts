import {loadBracketPairs, runWithActive} from './service/StorageService';
import {BracketPair} from './entity/BracketPair';

//////////////////////
//     LISTENER     //
//////////////////////

document.addEventListener('keypress', (event: KeyboardEvent): void => {
	const target = event.target as HTMLInputElement | HTMLTextAreaElement;
	if (!target) {
		return;
	}
	if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
		return;
	}
	const selectedText: string = getSelectedTextForInput(target);
	if (!selectedText) {
		return;
	}
	event.preventDefault();
	loadBracketPairs().then((bracketPairs: BracketPair[]): void => {
		const index: number = bracketPairs.map((pair: BracketPair): string => pair.l).indexOf(event.key);
		if (index === -1) {
			insertTextForInput(target, event.key);
			return;
		}
		if (!bracketPairs[index].active) {
			insertTextForInput(target, event.key);
			return;
		}
		runWithActive(
			(): void => setSelectedTextForInput(target, bracketPairs[index]),
			(): void => insertTextForInput(target, event.key));
	});
});

document.addEventListener('keypress', (event: KeyboardEvent): void => {
	const target = event.target as HTMLElement;
	if (!target.matches('[contenteditable]')) {
		return;
	}
	const selectedText: string = getSelectedTextForContentEditable(target);
	if (!selectedText) {
		return;
	}
	const element: Element | undefined = findInWith(target, selectedText);
	if (!element) {
		return;
	}
	event.preventDefault();
	loadBracketPairs().then((bracketPairs: BracketPair[]) => {
		const index: number = bracketPairs.map((pair: BracketPair): string => pair.l).indexOf(event.key);
		if (index === -1) {
			insertTextForContentEditable(element, event.key);
			return;
		}
		if (!bracketPairs[index].active) {
			insertTextForContentEditable(element, event.key);
			return;
		}
		runWithActive(
			(): void => setSelectedTextForContentEditable(target, bracketPairs[index]),
			(): void => insertTextForContentEditable(element, event.key));
	});
});

//////////////////////
// INPUT & TEXTAREA //
//////////////////////

function getSelectedTextForInput(input: HTMLInputElement | HTMLTextAreaElement): string {
	const start: number | null = input.selectionStart;
	const end: number | null = input.selectionEnd;
	if (start === null || end === null) {
		return '';
	}
	return input.value.substring(start, end);
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

function insertTextForInput(element: HTMLInputElement | HTMLTextAreaElement, text: string): void {
	const startPos: number = element.selectionStart ?? 0;
	const endPos: number = element.selectionEnd ?? (element.textContent?.length ?? 0) - 1;
	const selectionEnd: number = startPos + text.length;
	element.setRangeText(text, startPos, endPos, 'end');
	element.selectionStart = selectionEnd;
	element.selectionEnd = selectionEnd;
}

//////////////////////
// CONTENT EDITABLE //
//////////////////////

function getSelectedTextForContentEditable(element: HTMLElement): string {
	const range: Range | undefined = window.getSelection()?.getRangeAt(0);
	if (!range || range.startContainer !== range.endContainer) {
		return '';
	}
	const start: number = range.startOffset;
	const end: number = range.endOffset;
	return element.innerText.substring(start, end);
}

function setSelectedTextForContentEditable(element: HTMLElement, bracketPair: BracketPair): void {
	const selection: Selection | null = document.getSelection();
	const anchorOffset: number = selection?.anchorOffset ?? 0;
	const focusOffset: number = selection?.focusOffset ?? 0;

	if (selection) {
		const range: Range = selection.getRangeAt(0);
		const selectedText: string = range.toString();

		range.deleteContents();
		const textNode: Text = document.createTextNode(bracketPair.l + selectedText + bracketPair.r);

		function handleInputEvent(e: Event): void {
			element.removeEventListener('input', handleInputEvent);
			setTimeout((): void => {
				const data: string | null = (e as InputEvent).data;
				const found: Element | undefined = findInWith(e.target as HTMLElement, selectedText);
				if (data && found) {
					const newRange: Range = document.createRange();
					newRange.setStart(found.firstChild!, Math.min(anchorOffset, focusOffset) + 1);
					newRange.setEnd(found.firstChild!, Math.max(anchorOffset, focusOffset) + 1);
					selection?.removeAllRanges();
					selection?.addRange(newRange);
				}
			}, 1);
		}

		element.addEventListener('input', handleInputEvent);

		const inputEvent = new InputEvent('input', {
			data: textNode.textContent,
			inputType: 'insertText',
			bubbles: true,
			cancelable: true,
			composed: true
		});

		element.dispatchEvent(inputEvent);
	}
}

function insertTextForContentEditable(element: Element, text: string): void {
	const selection: Selection | null = window.getSelection();
	if (selection && selection.rangeCount > 0) {
		const range: Range = selection.getRangeAt(0);
		const textNode: Text = document.createTextNode(text);

		range.deleteContents();

		const inputEvent = new InputEvent('input', {
			data: textNode.textContent,
			inputType: 'insertText',
			bubbles: true,
			cancelable: true,
			composed: true
		});

		element.dispatchEvent(inputEvent);
	}
}

///////////////////////
//     UTILITIES     //
///////////////////////

function findInWith(target: HTMLElement, selectedText: string): Element | undefined {
	return Array.from(target.querySelectorAll(`*:not(:has(*))`))
		.find((el: Element): boolean => el.textContent?.includes(selectedText) ?? false);
}
