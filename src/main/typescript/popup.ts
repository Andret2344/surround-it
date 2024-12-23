import '../scss/popup.scss';
import 'jquery';
import {runWithActive, setActive} from './storage';

if ($ !== undefined) {
	let active = false;
	runWithActive((): void => {
		active = true;
		$('#power-button').addClass('active');
	}, () => active = false);

	$('#power-button').on('click', (): void => {
		if (active) {
			setActive(false, () => {
				$('#power-button').removeClass('active');
			});
		} else {
			setActive(true, () => {
				$('#power-button').addClass('active');
			});
		}
		active = !active;
	});
}
