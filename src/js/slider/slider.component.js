import { Component, getContext } from 'rxcomp';
import { takeUntil, tap } from 'rxjs/operators';
import DragService, { DragDownEvent, DragMoveEvent, DragUpEvent } from '../drag/drag.service';

export default class SliderComponent extends Component {

	get items() {
		return this.items_ || [];
	}
	set items(items) {
		if (this.items_ !== items) {
			this.items_ = items;
		}
	}

	get current() {
		return this.state.current || 0;
	}
	set current(current = 0) {
		if (this.state.current !== current) {
			this.state.current = current;
			console.log('current');
			this.change.next(current);
		}
		// this.state.current = Math.min(current, items ? items.length - 1 : 0);
	}

	get state() {
		if (!this.state_) {
			this.state_ = { current: 0 };
		}
		return this.state_;
	}

	get wrapperStyle() {
		return { 'transform': 'translate3d(' + -100 * this.state.current + '%, 0, 0)' };
	}

	get innerStyle() {
		return { 'width': 100 * this.items.length + '%' };
	}

	onInit() {
		const { node } = getContext(this);
		this.container = node;
		this.wrapper = node.querySelector('.slider__wrapper');
		setTimeout(() => {
			// this.change.next(this.current);
			/*
			gsap.set(this.wrapper, {
				x: -100 * this.current + '%',
			});
			*/
			this.slider$().pipe(
				takeUntil(this.unsubscribe$),
			).subscribe(event => {
				// console.log('dragService', event);
			});
		}, 1);
	}

	slider$() {
		let translation, dragDownEvent, dragMoveEvent;
		return DragService.events$(this.wrapper).pipe(
			tap((event) => {
				if (event instanceof DragDownEvent) {
					translation = this.getTranslation(this.wrapper, this.container);
					dragDownEvent = event;
				} else if (event instanceof DragMoveEvent) {
					dragMoveEvent = this.onDragMoveEvent(dragDownEvent, event, translation);
					console.log('DragMoveEvent');
				} else if (event instanceof DragUpEvent) {
					if (dragMoveEvent) {
						this.container.classList.remove('dragging');
						this.wrapper.style.transform = null;
						this.onDragUpEvent(dragDownEvent, dragMoveEvent);
					}
					console.log('DragUpEvent');
				}
			})
		);
	}

	onDragMoveEvent(dragDownEvent, dragMoveEvent, translation) {
		this.container.classList.add('dragging');
		const transformX = translation.x + dragMoveEvent.distance.x;
		this.wrapper.style.transform = `translate3d(${transformX}px, ${0}px, ${0}px)`;
		return dragMoveEvent;
	}

	onDragUpEvent(dragDownEvent, dragMoveEvent) {
		const width = this.container.offsetWidth;
		if (dragMoveEvent.distance.x * -1 > width * 0.25 && this.hasNext()) {
			this.navTo(this.current + 1);
		} else if (dragMoveEvent.distance.x * -1 < width * -0.25 && this.hasPrev()) {
			this.navTo(this.current - 1);
		} else {
			this.wrapper.style.transform = `translate3d(${-100 * this.current}%, 0, 0)`;
			// this.navTo(this.current);
		}
		// this.navTo(current);
	}

	navTo(current) {
		this.current = current;
		this.pushChanges();
	}

	hasPrev() {
		return this.current - 1 >= 0;
	}

	hasNext() {
		return this.current + 1 < this.items.length;
	}

	getTranslation(node, container) {
		let x = 0,
			y = 0,
			z = 0;
		const transform = node.style.transform;
		if (transform) {
			const coords = transform.split('(')[1].split(')')[0].split(',');
			x = parseFloat(coords[0]);
			y = parseFloat(coords[1]);
			z = parseFloat(coords[2]);
			x = coords[0].indexOf('%') !== -1 ? x *= container.offsetWidth * 0.01 : x;
			y = coords[1].indexOf('%') !== -1 ? y *= container.offsetHeight * 0.01 : y;
		}
		return { x, y, z };
	}

}

SliderComponent.meta = {
	selector: '[slider]',
	inputs: ['items', 'current'],
	outputs: ['change', 'tween'],
};
