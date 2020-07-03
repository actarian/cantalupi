import { getContext } from 'rxcomp';
import SwiperDirective from './swiper.directive';

export default class SwiperSlidesDirective extends SwiperDirective {

	onInit() {
		const { node } = getContext(this);
		node.setAttribute('id', `swiper-${this.rxcompId}`);
		this.options = {
			slidesPerView: 1,
			spaceBetween: 0,
			breakpoints: {
				1024: {
					slidesPerView: 3,
					spaceBetween: 0,
				},
			},
			centeredSlides: true,
			loop: false,
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
	}

}

SwiperSlidesDirective.meta = {
	selector: '[swiper-slides]'
};
