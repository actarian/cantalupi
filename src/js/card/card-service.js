import { Component, getContext } from 'rxcomp';

export default class CardServiceComponent extends Component {

	onTween() {
		const { node } = getContext(this);
		const title = node.querySelector('.title');
		this.title = title.innerHTML;
	}

	onChange(index) {
		/*
		const { node } = getContext(this);
		this.items = Array.prototype.slice.call(node.querySelectorAll('.slider__slide')).map((node, index) => {
			const image = node.querySelector('img');
			const title = image.getAttribute('title') || image.getAttribute('alt');
			const url = image.getAttribute('lazy');
			return { node, url, title, id: index + 10000001 };
		});
		this.title = this.items[index].title;
		this.index = index;
		*/
	}

}

CardServiceComponent.meta = {
	selector: '[card-service]'
};
