import { getContext } from 'rxcomp';
import SwiperDirective from './swiper.directive';

export default class SwiperTopEventsDirective extends SwiperDirective {

	onInit() {
		const { node } = getContext(this);
		node.setAttribute('id', `swiper-${this.rxcompId}`);
		this.options = {
			slidesPerView: 1,
			spaceBetween: 2,
			breakpoints: {
				768: {
					slidesPerView: 2,
					spaceBetween: 2,
				},
				1024: {
					slidesPerView: 3,
					spaceBetween: 2,
				},
				1440: {
					slidesPerView: 4,
					spaceBetween: 2,
				},
				1920: {
					slidesPerView: 4,
					spaceBetween: 2,
				},
				2440: {
					slidesPerView: 5,
					spaceBetween: 2,
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
		// console.log('SwiperTopEventsDirective.onInit');
	}

}

SwiperTopEventsDirective.meta = {
	selector: '[swiper-top-events]'
};
