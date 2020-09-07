import { Component, getContext } from 'rxcomp';
import { takeUntil } from 'rxjs/operators';
import { BreakpointService } from './breakpoint/breakpoint.service';
import SessionStorageService from './storage/session-storage.service';

export default class AppComponent extends Component {

	onInit() {
		const { node } = getContext(this);
		node.classList.remove('hidden');
		const showCover = SessionStorageService.get('showCover');
		this.showCover = !showCover;
		SessionStorageService.set('showCover', true);

		BreakpointService.observe$({
			isMobile: '(max-width: 767px)'
		}).pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(results => {
			console.log('AppComponent.BreakpointService.results', results);
			this.isMobile = results.isMobile;
			this.pushChanges();
		});
	}

	onSkipCover(event) {
		console.log('AppComponent.onSkipCover');
		this.showCover = false;
		this.pushChanges();
	}

	onMenuToggle(opened) {
		console.log('AppComponent.onMenuToggle', opened);
	}
}

AppComponent.meta = {
	selector: '[app-component]',
};
