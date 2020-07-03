import { Directive, getContext } from 'rxcomp';
import { Subject } from 'rxjs';
import Swiper from 'swiper';

export default class SwiperDirective extends Directive {

	onInit() {
		const { node } = getContext(this);
		node.setAttribute('id', `swiper-${this.rxcompId}`);
		this.options = {
			slidesPerView: 'auto',
			spaceBetween: 0,
			centeredSlides: true,
			speed: 600,
			autoplay: {
				delay: 5000,
			},
			keyboardControl: true,
			mousewheelControl: false,
			pagination: {
				el: `#swiper-${this.rxcompId} .swiper-pagination`,
				clickable: true,
			},
			navigation: {
				nextEl: `#swiper-${this.rxcompId} .swiper-button-next`,
				prevEl: `#swiper-${this.rxcompId} .swiper-button-prev`,
			},
			keyboard: {
				enabled: true,
				onlyInViewport: true,
			},
		};
		this.init_();
	}

	get enabled() {
		return !window.matchMedia('print').matches;
	}

	onView() {
		setTimeout(() => {
			this.swiperInitOrUpdate_();
		}, 1);
	}

	onDestroy() {
		this.removeListeners_();
		this.swiperDestroy_();
	}

	onBeforePrint() {
		this.swiperDestroy_();
	}

	slideToIndex(index) {
		// console.log('SwiperDirective.slideToIndex', index);
		if (this.swiper) {
			this.swiper.slideTo(index);
		}
	}

	init_() {
		this.events$ = new Subject();
		if (this.enabled) {
			const { node } = getContext(this);
			gsap.set(node, { opacity: 0 });
			this.index = 0;
			const on = this.options.on || {};
			const self = this;
			on.slideChange = function() {
				const swiper = this;
				self.index = swiper.activeIndex;
				self.events$.next(self.index);
				self.pushChanges();
			};
			this.options.on = on;
			this.addListeners_();
		}
	}

	addListeners_() {
		this.onBeforePrint = this.onBeforePrint.bind(this);
		window.addEventListener('beforeprint', this.onBeforePrint);
		/*
		scope.$on('onResize', ($scope) => {
			this.onResize(scope, element, attributes);
		});
		*/
	}

	removeListeners_() {
		window.removeEventListener('beforeprint', this.onBeforePrint);
	}

	swiperInitOrUpdate_() {
		if (this.enabled) {
			const { node } = getContext(this);
			if (this.swiper) {
				this.swiper.update();
			} else {
				let swiper;
				const on = this.options.on || (this.options.on = {});
				const callback = on.init;
				if (!on.init || !on.init.swiperDirectiveInit) {
					on.init = function() {
						gsap.to(node, 0.4, {
							opacity: 1,
							ease: Power2.easeOut,
						});
						setTimeout(() => {
							if (typeof callback === 'function') {
								callback.apply(this, [swiper, element, scope]);
							}
						}, 1);
					};
					on.init.swiperDirectiveInit = true;
				}
				gsap.set(node, { opacity: 1 });
				swiper = new Swiper(node, this.options);
				this.swiper = swiper;
				this.swiper._opening = true;
				node.classList.add('swiper-init');
			}
		}
	}

	swiperDestroy_() {
		if (this.swiper) {
			this.swiper.destroy();
		}
	}

	openMore(event) {
		this.more.next(event);
	}
}

SwiperDirective.meta = {
	selector: '[swiper]',
	inputs: ['consumer'],
	outputs: ['more']
};
