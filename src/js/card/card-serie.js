import { Component } from 'rxcomp';

export default class CardSerieComponent extends Component {

	constructor() {
		super();
		this.index = 0;
	}

	onInit() {
		this.index = 0;
	}

	onOver(index) {
		this.index = index;
		this.pushChanges();
	}

}

CardSerieComponent.meta = {
	selector: '[card-serie]'
};
