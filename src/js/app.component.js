import { Component, getContext } from 'rxcomp';
import SessionStorageService from './storage/session-storage.service';

export default class AppComponent extends Component {

	onInit() {
		const { node } = getContext(this);
		node.classList.remove('hidden');
		const showCover = SessionStorageService.get('showCover');
		this.showCover = !showCover;
		SessionStorageService.set('showCover', true);
		this.sliderItems = [1, 2, 3];
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
