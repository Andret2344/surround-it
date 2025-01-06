import '../scss/options.scss';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import {BracketPair} from './entity/BracketPair';
import {loadBracketPairs, saveBracketPairs} from './service/StorageService';
import browser from 'webextension-polyfill';

const tbodyElement: HTMLElement = document.getElementById('tbody') as HTMLElement;
const currentBrackets: BracketPair[] = [];

document.querySelectorAll('[data-localizable]').forEach((element: Element): void => {
	const attribute: string | null = element.getAttribute('data-localizable');
	if (!attribute) {
		return;
	}
	const message: string = browser.i18n.getMessage(attribute);
	const translationAttr: string | null = element.getAttribute('data-localizable-attr');
	if (translationAttr) {
		element.setAttribute(translationAttr, message)
	} else {
		element.textContent = message;
	}
});

document.addEventListener('click', (ev: MouseEvent): void => {
	const target: Element | null = (ev.target as Element).closest('.bracket-active');
	if (!target) {
		return;
	}
	const bracket: string | null = target.getAttribute('data-bracket');
	const index: number = currentBrackets.findIndex((value: BracketPair): boolean => value.l === bracket);
	if (index !== -1) {
		currentBrackets[index] = {
			...currentBrackets[index],
			active: (target as HTMLInputElement).checked
		};
		saveBracketPairs(currentBrackets).then();
	}
});

document.addEventListener('click', (ev: MouseEvent): void => {
	const target: Element | null = (ev.target as Element).closest('.icon-container');
	if (!target) {
		return;
	}
	const bracket: string | null = target.getAttribute('data-bracket');
	const index: number = currentBrackets.findIndex((value: BracketPair): boolean => value.l === bracket);
	if (index !== -1) {
		currentBrackets.splice(index, 1);
		saveBracketPairs(currentBrackets).then();
		target.closest('.bracket-parent')?.remove();
	}
});

document.querySelectorAll('.add-input').forEach((el: Element): void =>
	el.addEventListener('input', (): void => {
		const bracketL: string = (document.querySelector('.add-l') as HTMLInputElement).value;
		const bracketR: string = (document.querySelector('.add-r') as HTMLInputElement).value;
		const text: Text = document.createTextNode(`${bracketL}xyz${bracketR}`);
		const addResult: Element | null = document.querySelector('.add-result');
		addResult?.firstChild?.remove();
		addResult?.appendChild(text);
	}));

document.querySelector('.add-submit')?.addEventListener('click', (): void => {
	const addLElement: HTMLInputElement | null = document.querySelector('.add-l') as HTMLInputElement;
	const addRElement: HTMLInputElement | null = document.querySelector('.add-r') as HTMLInputElement;
	const bracketL: string = addLElement.value;
	const bracketR: string = addRElement.value;
	if (!bracketL) {
		addLElement.setCustomValidity('Cannot be empty!');
		addLElement.reportValidity();
		return;
	}
	if (!bracketR) {
		addRElement.setCustomValidity('Cannot be empty!');
		addRElement.reportValidity();
		return;
	}
	const foundL = currentBrackets.find(value => value.l === bracketL);
	if (foundL) {
		addLElement.setCustomValidity('Such a left bracket is already defined!');
		addLElement.reportValidity();
		return;
	}

	const bracketPair = {
		l: bracketL,
		r: bracketR,
		active: true
	};
	addElement(bracketPair, currentBrackets.length);
	saveBracketPairs(currentBrackets).then((): void => {
		addLElement.value = '';
		addRElement.value = '';
		document.querySelector('.add-result')?.firstChild?.remove();
	});
});

function restoreOptions(): void {
	loadBracketPairs().then((bracketPairs: BracketPair[]): void => bracketPairs.forEach(addElement));
}

function addElement(bracketPair: BracketPair, index: number): void {
	currentBrackets.push(bracketPair);
	const escapedL: string = escapeHTML(bracketPair.l);
	const escapedR: string = escapeHTML(bracketPair.r);

	const html = `
        <tr class='bracket-parent'>
            <td>
            	<pre class='text-center'>${escapedL}</pre>
            </td>
            <td>
            	<pre class='text-center'>${escapedR}</pre>
            </td>
            <td>
            	<pre class='text-center'>${escapedL}xyz${escapedR}</pre>
            </td>
            <td class='text-center'>
            	<label for='active-${index}' style='display: none;'>${escapedL}${escapedR}</label>
            	<input 
            			id='active-${index}'
            			type='checkbox'
            			data-bracket='${escapedL}'
            			class='bracket-active'
						${(bracketPair.active ?? false) && 'checked'}
				/>
            </td>
            <td class='text-center'>
            	<span class='icon-container' data-bracket='${escapedL}'><i class='fa-solid fa-trash'></i></span>
			</td>
        </tr>`;
	tbodyElement.insertAdjacentHTML('beforeend', html);
}

function escapeHTML(str: string): string {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}

document.addEventListener('DOMContentLoaded', restoreOptions);
