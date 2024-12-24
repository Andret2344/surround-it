import '../scss/popup.scss';
import {runWithActive, setActive} from './service/StorageService';

const powerButton: Element | null = document.querySelector('#power-button');
if (powerButton) {
	runWithActive((): void => powerButton.classList.add('active'));

	powerButton.addEventListener('click', (): void =>
		runWithActive(
			(): void => setActive(false, (): void => powerButton.classList.remove('active')),
			(): void => setActive(true, (): void => powerButton.classList.add('active'))));
}
