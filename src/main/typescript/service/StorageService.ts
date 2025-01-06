import browser from 'webextension-polyfill';
import {BracketPair} from '../entity/BracketPair';

//////////////////////
//      ACTIVE      //
//////////////////////

function runWithActive(whenTrue: () => void, whenFalse: () => void = (): void => undefined): void {
	browser.storage.local.get('active').then((items: Record<string, any>): void => {
		// default == true
		if (items['active'] === false) {
			whenFalse();
		} else {
			whenTrue();
		}
	});
}

function setActive(active: boolean, callback: () => void = (): void => undefined): void {
	browser.storage.local.set({'active': active}).then(callback);
}

//////////////////////
//     BRACKETS     //
//////////////////////

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
	]
}

async function saveBracketPairs(bracketPairs: BracketPair[]): Promise<void> {
	return await browser.storage.local.set({bracketPairs});
}

async function loadBracketPairs(): Promise<BracketPair[]> {
	const value: Record<string, any> = await browser.storage.local.get('bracketPairs');
	return value['bracketPairs'] ?? getDefaultBracketPairs();
}

export {
	runWithActive,
	setActive,
	saveBracketPairs,
	loadBracketPairs
};
