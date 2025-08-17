import '../scss/popup.scss';
import {loadActive, setActive} from './service/StorageService';
import browser from 'webextension-polyfill';

const powerButton: Element | null = document.querySelector('.power-button');
if (powerButton) {
	loadActive().then((active: boolean): void => {
		powerButton.classList.toggle('active', active);

		powerButton.addEventListener('click', (): void =>
			setActive(!active, (): boolean => powerButton.classList.toggle('active', !active)));
	})
}

document.querySelector('#options-button')?.addEventListener('click', (): Promise<void> => browser.runtime.openOptionsPage());
