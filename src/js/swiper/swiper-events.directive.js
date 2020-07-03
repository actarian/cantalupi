import { getContext } from 'rxcomp';
import SwiperDirective from './swiper.directive';

export default class SwiperEventsDirective extends SwiperDirective {

	onInit() {
		const { node } = getContext(this);
		node.setAttribute('id', `swiper-${this.rxcompId}`);
		this.options = {
			slidesPerView: 1,
			spaceBetween: 15,
			breakpoints: {
				1024: {
					slidesPerView: 2,
					spaceBetween: 1,
				},
				1440: {
					slidesPerView: 2.5,
					spaceBetween: 1,
				},
			},
			centeredSlides: false,
			// loop: true,
			loopAdditionalSlides: 100,
			speed: 600,
			/*
			autoplay: {
				delay: 5000,
			},
			*/
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
		// console.log('SwiperEventsDirective.onInit');
	}

}

SwiperEventsDirective.meta = {
	selector: '[swiper-events]'
};
