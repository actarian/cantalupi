import { fromEvent, of } from 'rxjs';
import { filter, finalize, first, map } from 'rxjs/operators';
// import { getResourceRoot } from '../environment';

let UID = 0;

export default class ImageService {

	static worker() {
		if (!this.worker_) {
			this.worker_ = new Worker(`/cantalupi/js/workers/image.service.worker.js`);
			// this.worker_ = new Worker(`${getResourceRoot()}js/workers/image.service.worker.js`);
		}
		return this.worker_;
	}

	static load$(src) {
		// if (!('Worker' in window) || this.isBlob(src) || this.isCors(src)) {
		if (!('Worker' in window) || this.isBlob(src)) {
			return of(src);
		}
		const id = ++UID;
		const worker = this.worker();
		worker.postMessage({ src, id });
		return fromEvent(worker, 'message').pipe(
			filter(event => event.data.src === src),
			map(event => {
				const url = URL.createObjectURL(event.data.blob);
				return url;
			}),
			first(),
			finalize(url => {
				worker.postMessage({ id });
				if (url) {
					URL.revokeObjectURL(url);
				}
			})
		);
	}

	static isCors(src) {
		return src.indexOf('//') !== -1 && src.indexOf(window.location.host) === -1;
	}

	static isBlob(src) {
		return src.indexOf('blob:') === 0;
	}

}
