import browser, {Storage} from 'webextension-polyfill';
import {BracketPair} from '../entity/BracketPair';
import StorageChange = Storage.StorageChange;

//////////////////////
//      ACTIVE      //
//////////////////////

let featureActive: boolean = true;

initActive().then();

function isActive(): boolean {
	return featureActive;
}

async function loadActive(): Promise<boolean> {
	const record: Record<string, unknown> = await browser.storage.local.get('active');
	return record['active'] as boolean ?? false;
}

async function initActive(): Promise<void> {
	featureActive = await loadActive();
}

browser.storage.onChanged.addListener((changes: Record<string, StorageChange>, area: string): void => {
	if (area === 'local' && changes.active) {
		featureActive = changes.active.newValue !== false;
	}
});

function setActive(active: boolean, callback: (() => void) | undefined = undefined): void {
	featureActive = active;
	browser.storage.local.set({active}).then(callback);
}

//////////////////////
//     BRACKETS     //
//////////////////////

let brackets: BracketPair[] = [];

initBrackets().then();

function getActiveBracketPairs(): BracketPair[] {
	return brackets.filter((p: BracketPair): boolean => p.active);
}

function getDefaultBracketPairs(): BracketPair[] {
	return [
		{l: '(', r: ')', active: true},
		{l: '{', r: '}', active: true},
		{l: '<', r: '>', active: true},
		{l: '[', r: ']', active: true},
		{l: '\'', r: '\'', active: true},
		{l: '"', r: '"', active: true},
		{l: '`', r: '`', active: true},
		{l: '_', r: '_', active: false},
		{l: '*', r: '*', active: false},
		{l: '~', r: '~', active: false},
		{l: '/', r: '/', active: false},
		{l: '\\', r: '\\', active: false},
		{l: '#', r: '#', active: false},
		{l: '$', r: '$', active: false},
		{l: '%', r: '%', active: false},
		{l: '|', r: '|', active: false}
	];
}

async function saveBracketPairs(bracketPairs: BracketPair[]): Promise<void> {
	return await browser.storage.local.set({bracketPairs});
}

async function loadBracketPairs(): Promise<BracketPair[]> {
	const value: Record<string, any> = await browser.storage.local.get('bracketPairs');
	return value['bracketPairs'] ?? getDefaultBracketPairs();
}

async function initBrackets(): Promise<void> {
	brackets = await loadBracketPairs();
}

browser.storage.onChanged.addListener((changes: Record<string, StorageChange>, area: string): void => {
	if (area !== 'local') {
		return;
	}
	if (changes.bracketPairs) {
		const newValue: BracketPair[] = changes.bracketPairs.newValue as BracketPair[];
		brackets = newValue ?? getDefaultBracketPairs();
	}
	if (changes.active) {
		featureActive = changes.active.newValue as boolean;
	}
});

export {
	isActive,
	setActive,
	loadActive,
	saveBracketPairs,
	getActiveBracketPairs,
	loadBracketPairs
};
