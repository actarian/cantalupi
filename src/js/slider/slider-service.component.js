import { getContext } from 'rxcomp';
import SliderComponent from './slider.component';

export default class SliderServiceComponent extends SliderComponent {

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
		console.log('SliderServiceComponent.onInit', this.items);
	}
}

SliderServiceComponent.meta = {
	selector: '[slider-service]',
	outputs: ['change', 'tween'],
};
