import '../scss/popup.scss';
import {runWithActive, setActive} from './storage';

const powerButton: Element | null = document.querySelector('#power-button');
if (powerButton) {
	let active: boolean = false;
	runWithActive((): void => {
		active = true;
		powerButton.classList.add('active');
	}, () => active = false);

	powerButton.addEventListener('click', (): void => {
		if (active) {
			setActive(false, () => powerButton.classList.remove('active'));
		} else {
			setActive(true, () => powerButton.classList.add('active'));
		}
		active = !active;
	});
}
