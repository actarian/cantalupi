import { Component, getContext } from 'rxcomp';

export default class AppComponent extends Component {

	onInit() {
		const { node } = getContext(this);
		node.classList.remove('hidden');
		this.showCover = true;
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
