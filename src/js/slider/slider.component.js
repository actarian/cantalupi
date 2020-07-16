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
		this.state.current = current;
		// this.state.current = Math.min(current, items ? items.length - 1 : 0);
	}

	get state() {
		if (!this.state_) {
			this.state_ = {};
		}
		return this.state_;
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
		let transformX = 0,
			transformY = 0,
			transformZ = 0,
			distanceX = 0,
			distanceY = 0,
			initialTransformX;
		return DragService.events$(this.wrapper).pipe(
			tap((event) => {
				if (event instanceof DragDownEvent) {
					const translation = this.getTranslation(this.wrapper, this.container);
					initialTransformX = translation.x;
				} else if (event instanceof DragMoveEvent) {
					this.container.classList.add('dragging');
					distanceX = event.distance.x;
					distanceY = event.distance.y;
					transformX = initialTransformX + event.distance.x;
					this.wrapper.style.transform = `translate3d(${transformX}px, ${transformY}px, ${transformZ}px)`;
				} else if (event instanceof DragUpEvent) {
					this.container.classList.remove('dragging');
					this.wrapper.style.transform = null;
					const width = this.container.offsetWidth;
					if (distanceX * -1 > width * 0.25 && this.hasNext()) {
						this.navTo(this.current + 1);
					} else if (distanceX * -1 < width * -0.25 && this.hasPrev()) {
						this.navTo(this.current - 1);
					} else {
						this.wrapper.style.transform = `translate3d(${-100 * this.current}%, 0, 0)`;
						// this.navTo(this.current);
					}
					// this.navTo(current);
				}
			})
		);
	}

	tweenTo(current, callback) {
		// console.log('tweenTo', current);
		const container = this.container;
		const wrapper = this.wrapper;
		const width = this.container.offsetWidth;
		gsap.to(wrapper, 0.50, {
			x: -100 * current + '%',
			delay: 0,
			ease: Power3.easeInOut,
			overwrite: 'all',
			onUpdate: () => {
				this.tween.next();
			},
			onComplete: () => {
				if (typeof callback === 'function') {
					callback();
				}
			}
		});
	}

	navTo(current) {
		this.current = current;
		this.pushChanges();
		/*
		if (this.current !== current) {
			this.tweenTo(current, () => {
				this.current = current;
				this.pushChanges();
				this.change.next(this.current);
			});
		}
		*/
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
