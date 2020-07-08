import { Directive, getContext } from 'rxcomp';
import { of , ReplaySubject } from 'rxjs';
import { delay, distinctUntilChanged, first, switchMap, takeUntil } from 'rxjs/operators';
import ImageService from '../image/image.service';
import IntersectionService from '../intersection/intersection.service';
import LocomotiveService from '../locomotive/locomotive.service';
import LazyCache from './lazy.cache';

const useIntersection = true;

export default class LazyPictureDirective extends Directive {

	onInit() {
		const { node } = getContext(this);
		const imgs = node.querySelectorAll('img');
		if (imgs.length > 1) {
			throw ('LazyPictureDirective.error only one img tag allowed');
		}
		if (imgs.length === 0) {
			throw ('LazyPictureDirective.error one img tag needed');
		}
		const img = imgs[0];
		// node.classList.add('lazy');
		this.src$ = new ReplaySubject(1).pipe(
			distinctUntilChanged(),
			switchMap(src => {
				const data = LazyCache.get(src);
				if (data) {
					return of(data);
				}
				// node.classList.remove('lazyed');
				this.setAnimation(0);
				return useIntersection ? this.intersection$(src) : this.lazy$(src);
			}),
			takeUntil(this.unsubscribe$)
		);
		this.src$.subscribe(src => {
			if (!useIntersection) {
				LazyCache.set(this.lazyPicture, src);
				img.setAttribute('src', src);
			}
			// node.classList.add('lazyed');
			LocomotiveService.instance$.pipe(
				first(),
				delay(10),
			).subscribe(instance => {
				instance.update();
				this.animate();
			});
		});
		node.addEventListener('click', () => {
			this.setAnimation(0);
			this.animate();
		});
	}

	setAnimation(value) {
		const { node } = getContext(this);
		const overlay = node.querySelector('.lazy-picture__overlay');
		const o2 = 1 - value;
		const p2 = 100 * value;
		gsap.set(overlay, {
			// background: `radial-gradient(ellipse at center,rgba(0,0,0,0) 0px,rgba(0,0,0,${o2}) ${p2}%)`
			background: `linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,${o2}) ${p2}%)`
		});
	}

	animate() {
		const { node } = getContext(this);
		const overlay = node.querySelector('.lazy-picture__overlay');
		const o = { value: 0 };
		gsap.to(o, 3, {
			value: 1,
			delay: 1,
			overwrite: true,
			ease: Power4.easeOut,
			onUpdate: () => {
				const o2 = 1 - o.value;
				const p2 = 100 * o.value;
				gsap.set(overlay, {
					// background: `radial-gradient(ellipse at center,rgba(0,0,0,0) 0px,rgba(0,0,0,${o2}) ${p2}%)`
					background: `linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,${o2}) ${p2}%)`
				});
			},
			onCompleted: () => {
				gsap.set(overlay, {
					background: `none`
				});
			}
		});
	}

	onChanges() {
		this.src$.next(this.lazyPicture);
	}

	lazy$(src) {
		const { node } = getContext(this);
		return IntersectionService.firstIntersection$(node).pipe(
			// tap(entry => console.log(entry)),
			switchMap(() => ImageService.load$(src)),
			takeUntil(this.unsubscribe$),
		);
	}

	intersection$(src) {
		const { node } = getContext(this);
		const img = node.querySelector('img');
		return ImageService.load$(src).pipe(
			switchMap((src) => {
				LazyCache.set(this.lazyPicture, src);
				img.setAttribute('src', src);
				return IntersectionService.firstIntersection$(node);
			}),
			takeUntil(this.unsubscribe$),
		);
	}

}

LazyPictureDirective.meta = {
	selector: '[lazyPicture],[[lazyPicture]]',
	inputs: ['lazyPicture']
};
