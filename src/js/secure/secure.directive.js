import { Directive, getContext } from 'rxcomp';
import { fromEvent } from 'rxjs';
import { first, map, takeUntil } from 'rxjs/operators';
import ApiService from '../api/api.service';
import DownloadService from '../download/download.service';
import { STATIC } from '../environment';
import ModalService, { ModalResolveEvent } from '../modal/modal.service';
import UserService from '../user/user.service';

const src = STATIC ? '/tiemme-com/club-modal.html' : '/Viewdoc.cshtml?co_id=23649';

export default class SecureDirective extends Directive {

	onInit() {
		const { node } = getContext(this);
		this.href = node.getAttribute('href');
		fromEvent(node, 'click').pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(event => {
			event.preventDefault();
			this.tryDownloadHref();
		});
	}

	onChanges() {
		const { node } = getContext(this);
		this.href = node.getAttribute('href');
	}

	tryDownloadHref() {
		ApiService.staticGet$(this.href, undefined, 'blob').pipe(
			first(),
			map(response => response.data),
		).subscribe(blob => {
			DownloadService.download(blob, this.href.split('/').pop());
		}, error => {
			console.log(error);
			this.onLogin(event);
		});
	}

	onLogin(event) {
		// console.log('SecureDirective.onLogin');
		// event.preventDefault();
		ModalService.open$({ src: src, data: { view: 1 } }).pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(event => {
			// console.log('SecureDirective.onLogin', event);
			if (event instanceof ModalResolveEvent) {
				UserService.setUser(event.data);
				this.tryDownloadHref();
			}
		});
		// this.pushChanges();
	}

	/*
	onRegister(event) {
		// console.log('SecureDirective.onRegister');
		// event.preventDefault();
		ModalService.open$({ src: src, data: { view: 2 } }).pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(event => {
			// console.log('SecureDirective.onRegister', event);
			if (event instanceof ModalResolveEvent) {
				UserService.setUser(event.data);
			}
		});
		// this.pushChanges();
	}
	*/

}

SecureDirective.meta = {
	selector: '[secure]',
};
