import {getBracketPairs, isActive} from './service/StorageService';
import {BracketPair} from './entity/BracketPair';

//////////////////////
// INPUT & TEXTAREA //
//////////////////////

document.addEventListener('beforeinput', (event: InputEvent): void => {
	const target = event.target as HTMLInputElement | HTMLTextAreaElement | null;
	if (!isActive() || !target || event.isComposing || event.inputType !== 'insertText' || typeof event.data !== 'string') {
		return;
	}

	const isTextBox: boolean =
		target instanceof HTMLTextAreaElement ||
		target instanceof HTMLInputElement && !target.readOnly && !target.disabled;
	if (!isTextBox) {
		return;
	}

	const selectionStart: number | null = target.selectionStart;
	const selectionEnd: number | null = target.selectionEnd;
	if (selectionStart == null || selectionEnd == null) {
		return;
	}

	const pair: BracketPair | undefined = getBracketPairs().find((p: BracketPair): boolean => p.l === event.data);
	if (!pair?.active) {
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
	const target = event.target as HTMLElement | null;
	const root = target?.closest('[contenteditable]') as HTMLElement | null;
	if (!isActive() || !root || event.isComposing || event.inputType !== 'insertText' || typeof event.data !== 'string') {
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

	const pair: BracketPair | undefined = getBracketPairs().find((p: BracketPair): boolean => p.l === event.data);
	if (!pair?.active) {
		return;
	}

	event.preventDefault();

	if (range.collapsed) {
		insertPairAtCaret(root, pair.l, pair.r);
	} else {
		setSelectedTextForContentEditable(root, pair);
	}
});

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
