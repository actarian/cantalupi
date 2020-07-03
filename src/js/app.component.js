import { Component, getContext } from 'rxcomp';

export default class AppComponent extends Component {

	onInit() {
		const { node } = getContext(this);
		node.classList.remove('hidden');
		this.showCover = true;
		// this.asideActive = false;
	}

	// onView() { const context = getContext(this); }

	// onChanges() {}

	// onDestroy() {}

	onSkipCover(event) {
		console.log('AppComponent.onSkipCover');
		this.showCover = false;
		this.pushChanges();
	}

	/*
	onAsideToggle($event) {
		const { node } = getContext(this);
		if ($event) {
			node.classList.add('aside--active');
			node.classList.remove('notification--active');
		} else {
			node.classList.remove('aside--active');
		}
	}
	*/
}

AppComponent.meta = {
	selector: '[app-component]',
};
