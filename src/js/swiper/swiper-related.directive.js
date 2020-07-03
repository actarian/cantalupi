import { getContext } from 'rxcomp';
import SwiperDirective from './swiper.directive';

export default class SwiperRelatedDirective extends SwiperDirective {

	onInit() {
		const { node } = getContext(this);
		node.setAttribute('id', `swiper-${this.rxcompId}`);
		this.options = {
			slidesPerView: 'auto',
			spaceBetween: 1,
			centeredSlides: false,
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

SwiperRelatedDirective.meta = {
	selector: '[swiper-related]'
};
