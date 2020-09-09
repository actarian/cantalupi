import { getContext } from 'rxcomp';
import SliderComponent from './slider.component';

export default class SliderProductsRelatedComponent extends SliderComponent {

	get wrapperStyle() {
		const node = this.items[this.state.current].node;
		return { 'transform': `translate3d(${-node.offsetLeft}px, 0px, 0px)` };
	}

	get innerStyle() {
		if (this.items.length) {
			const lastNode = this.items[this.items.length - 1].node;
			// console.log(lastNode.offsetLeft + lastNode.offsetWidth);
			return { 'width': (lastNode.offsetLeft + lastNode.offsetWidth) + 'px' };
		} else {
			return { 'width': 'auto' };
		}
	}

	onInit() {
		super.onInit();
		const { node } = getContext(this);
		this.items = Array.prototype.slice.call(node.querySelectorAll('.slider__slide')).map((node, index) => {
			const image = node.querySelector('img');
			const url = image.getAttribute('lazy');
			const title = node.querySelector('.title');
			return { node, url, title, id: index + 10000001 };
		});
	}

	onDragUpEvent(dragDownEvent, dragMoveEvent) {
		const containerRect = this.container.getBoundingClientRect();
		const wrapperRect = this.wrapper.getBoundingClientRect();
		const tx = wrapperRect.left - containerRect.left;
		const getCenterX = (index) => {
			const node = this.items[index].node;
			const cx = node.offsetLeft; // + node.offsetWidth / 2;
			return cx;
		};
		const current = this.items.reduce((p, item, i) => {
			if (p === -1) {
				return i;
			} else {
				let ix = getCenterX(i);
				let px = getCenterX(p);
				ix = Math.abs(tx + ix);
				px = Math.abs(tx + px);
				return ix < px ? i : p;
			}
		}, -1);
		if (this.state.current !== current) {
			this.navTo(current);
		} else {
			const node = this.items[current].node;
			this.wrapper.style = `transform: translate3d(${-node.offsetLeft}px, 0px, 0px);`;
		}
	}

}

SliderProductsRelatedComponent.meta = {
	selector: '[slider-products-related]',
	outputs: ['change', 'tween'],
};
