import LocomotiveScroll from "locomotive-scroll";
import { fromEventPattern, ReplaySubject } from "rxjs";
import { switchMap } from "rxjs/operators";

export default class LocomotiveService {

	static locomotive$(element) {
		if (!this.init_) {
			this.init_ = true;
			setTimeout(() => {
				const ls = new LocomotiveScroll({
					el: element,
					smooth: false,
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
				this.instance$.next(ls);
			}, 200);
		}
		return this.instance$;
	}
}

LocomotiveService.instance$ = new ReplaySubject(1);

LocomotiveService.scroll$ = LocomotiveService.instance$.pipe(
	switchMap(ls => fromEventPattern((handler) => {
		ls.on('scroll', handler);
	}, (handler) => {
		ls.off('scroll', handler);
	}))
);
