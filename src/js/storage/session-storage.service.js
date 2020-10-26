import { ReplaySubject } from 'rxjs';
import StorageService from './storage.service';

export default class SessionStorageService extends StorageService {
	static items$ = new ReplaySubject(1);
	static clear() {
		if (this.isSupported()) {
			sessionStorage.clear();
			this.items$.next(this.toArray());
		}
	}
	static delete(name) {
		if (this.isSupported()) {
			sessionStorage.removeItem(name);
			this.items$.next(this.toArray());
		}
	}
	static exist(name) {
		if (this.isSupported()) {
			return sessionStorage.getItem(name) !== undefined;
		} else {
			return false;
		}
	}
	static get(name) {
		return this.decode(this.getRaw(name));
	}
	static set(name, value) {
		this.setRaw(name, this.encode(value));
	}
	static getRaw(name) {
		let value = null;
		if (this.isSupported()) {
			value = sessionStorage.getItem(name);
		}
		return value;
	}
	static setRaw(name, value) {
		if (value && this.isSupported()) {
			sessionStorage.setItem(name, value);
			this.items$.next(this.toArray());
		}
	}
	static toArray() {
		return this.toRawArray().map(x => {
			x.value = this.decode(x.value);
			return x;
		});
	}
	static toRawArray() {
		if (this.isSupported()) {
			return Object.keys(sessionStorage).map(key => {
				return {
					name: key,
					value: this.getRaw(key),
				};
			});
		} else {
			return [];
		}
	}
	static isSupported() {
		if (this.supported) {
			return true;
		}
		return StorageService.isSupported('sessionStorage');
	}
}
