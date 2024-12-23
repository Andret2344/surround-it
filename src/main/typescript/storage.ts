import browser from 'webextension-polyfill';

export function runWithActive(whenTrue: () => void, whenFalse: () => void = (): void => undefined): void {
	browser.storage.local.get('active').then((items: Record<string, any>): void => {
		// default == true
		if (items['active'] === false) {
			whenFalse();
		} else {
			whenTrue();
		}
	});
}

export function setActive(active: boolean, callback: () => void): void {
	browser.storage.local.set({'active': active}).then((): void => {
		callback();
	});
}
