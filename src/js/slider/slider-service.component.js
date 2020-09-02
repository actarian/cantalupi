import { getContext } from 'rxcomp';
import SliderComponent from './slider.component';

export default class SliderServiceComponent extends SliderComponent {

	get current() {
		return this.state.current || 0;
	}
	set current(current = 0) {
		if (this.state.current !== current) {
			this.state.current = current;
			this.title = this.items[current].title;
			this.change.next(current);
		}
	}

	get currentLabel() {
		return this.current + 1;
	}

	get totalLabel() {
		return this.items.length;
	}

	onInit() {
		super.onInit();
		const { node } = getContext(this);
		this.items = Array.prototype.slice.call(node.querySelectorAll('.slider__slide')).map((node, index) => {
			const image = node.querySelector('img');
			const title = image.getAttribute('title') || image.getAttribute('alt');
			const url = image.getAttribute('lazy');
			return { node, url, title, id: index + 10000001 };
		});
		this.title = node.querySelector('.title').innerText;
		console.log('SliderServiceComponent.onInit', this.items);
	}
}

SliderServiceComponent.meta = {
	selector: '[slider-service]',
	outputs: ['change', 'tween'],
};
