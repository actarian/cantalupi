import LocomotiveScroll from "locomotive-scroll";
import { ReplaySubject } from "rxjs";

export default class LocomotiveService {

	static locomotive$(element) {
		if (!this.init_) {
			this.init_ = true;
			setTimeout(() => {
				const scroll = new LocomotiveScroll({
					el: element,
					smooth: true,
					getSpeed: true,
					getDirection: false,
					useKeyboard: true,
					smoothMobile: true,
					inertia: 1,
					class: "is-inview",
					scrollbarClass: "c-scrollbar",
					scrollingClass: "has-scroll-scrolling",
					draggingClass: "has-scroll-dragging",
					smoothClass: "has-scroll-smooth",
					initClass: "has-scroll-init"
				});
				this.scroll$.next(scroll);
			}, 200);
		}
		return this.scroll$;
	}
}

LocomotiveService.scroll$ = new ReplaySubject(1);
