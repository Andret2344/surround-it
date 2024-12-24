export interface BracketPair {
	readonly l: string;
	readonly r: string;
}

export function getAllBracketPairs(): BracketPair[] {
	return [
		{l: '(', r: ')'},
		{l: '{', r: '}'},
		{l: '<', r: '>'},
		{l: '[', r: ']'},
		{l: '\'', r: '\''},
		{l: '"', r: '"'},
		{l: '`', r: '`'}
	]
}
