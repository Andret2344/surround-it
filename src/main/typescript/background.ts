import {BracketPair} from './entity/BracketPair';
import {getProcessedBracketPair, isTextBox, isEventCorrect} from './guards';

//////////////////////
// INPUT & TEXTAREA //
//////////////////////

document.addEventListener('beforeinput', (event: InputEvent): void => {
	if (!isEventCorrect(event)) {
		return;
	}

	const target = event.target as HTMLInputElement | HTMLTextAreaElement | null;
	if (!isTextBox(target)) {
		return;
	}

	const selectionStart: number | null = target.selectionStart;
	const selectionEnd: number | null = target.selectionEnd;
	if (selectionStart == null || selectionEnd == null) {
		return;
	}

	const pair: BracketPair | null = getProcessedBracketPair(event.data);
	if (!pair) {
		return;
	}

	event.preventDefault();

	if (selectionStart === selectionEnd) {
		insertPairAtCaretInput(target, pair, selectionStart);
	} else {
		wrapSelectionWithBracketsInput(target, pair, selectionStart, selectionEnd);
	}
});

function insertPairAtCaretInput(element: HTMLInputElement | HTMLTextAreaElement, pair: BracketPair, cursorPosition: number): void {
	element.setRangeText(pair.l + pair.r, cursorPosition, cursorPosition, 'end');
	element.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
	element.dispatchEvent(new Event('input', {bubbles: true}));
}

function wrapSelectionWithBracketsInput(element: HTMLInputElement | HTMLTextAreaElement, pair: BracketPair, selectionStart: number, selectionEnd: number): void {
	const selectedLength: number = selectionEnd - selectionStart;
	const selected: string = element.value.substring(selectionStart, selectionEnd);
	element.setRangeText(pair.l + selected + pair.r, selectionStart, selectionEnd, 'select');
	element.setSelectionRange(selectionStart + 1, selectionStart + 1 + selectedLength);
	element.dispatchEvent(new Event('input', {bubbles: true}));
}

//////////////////////
// CONTENT EDITABLE //
//////////////////////

document.addEventListener('beforeinput', (event: InputEvent): void => {
	if (!isEventCorrect(event)) {
		return;
	}

	const root: HTMLElement | null = getRoot(event.target);
	if (!root) {
		return;
	}

	const selection: Selection | null = window.getSelection();
	if (!selection || selection.rangeCount === 0) {
		return;
	}

	const range: Range = selection.getRangeAt(0);
	if (!root.contains(range.commonAncestorContainer)) {
		return;
	}

	const pair: BracketPair | null = getProcessedBracketPair(event.data);
	if (!pair) {
		return;
	}

	event.preventDefault();

	if (range.collapsed) {
		insertPairAtCaret(root, pair.l, pair.r);
	} else {
		setSelectedTextForContentEditable(root, pair);
	}
});

function getRoot(target: EventTarget | null): HTMLElement | null {
	if (!target) {
		return null;
	}

	if (target instanceof HTMLElement) {
		if (target.isContentEditable) {
			return target;
		}
		return target.closest('[contenteditable="true"]');
	}

	if (target instanceof Node) {
		const element: HTMLElement | null = target.parentElement;
		if (!element) {
			return null;
		}
		if (element.isContentEditable) {
			return element;
		}
		return element.closest('[contenteditable="true"]');
	}

	return null;
}

function insertPairAtCaret(root: HTMLElement, l: string, r: string): void {
	const selection: Selection | null = window.getSelection();
	if (!selection || selection.rangeCount === 0) {
		return;
	}

	const range: Range = selection.getRangeAt(0);
	range.deleteContents();

	const left: Text = document.createTextNode(l);
	const right: Text = document.createTextNode(r);
	const frag: DocumentFragment = document.createDocumentFragment();
	frag.append(left, right);
	range.insertNode(frag);

	const caret: Range = document.createRange();
	caret.setStartAfter(left);
	caret.setEndAfter(left);
	selection.removeAllRanges();
	selection.addRange(caret);

	root.dispatchEvent(new Event('input', {bubbles: true}));
}

function setSelectedTextForContentEditable(root: HTMLElement, bracketPair: BracketPair): void {
	const selection: Selection | null = window.getSelection();
	if (!selection || selection.rangeCount === 0) {
		return;
	}

	const range: Range = selection.getRangeAt(0);
	if (range.collapsed) {
		insertPairAtCaret(root, bracketPair.l, bracketPair.r);
		return;
	}

	const content: DocumentFragment = range.cloneContents();
	range.deleteContents();

	const left: Text = document.createTextNode(bracketPair.l);
	const right: Text = document.createTextNode(bracketPair.r);
	const frag: DocumentFragment = document.createDocumentFragment();
	frag.append(left);
	frag.append(content);
	frag.append(right);
	range.insertNode(frag);

	const newRange: Range = document.createRange();
	newRange.setStartAfter(left);
	newRange.setEndBefore(right);
	selection.removeAllRanges();
	selection.addRange(newRange);

	root.dispatchEvent(new Event('input', {bubbles: true}));
}
