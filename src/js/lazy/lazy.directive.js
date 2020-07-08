import { Directive, getContext } from 'rxcomp';
import { of , Subject } from 'rxjs';
import { delay, distinctUntilChanged, first, switchMap, takeUntil } from 'rxjs/operators';
import ImageService from '../image/image.service';
import IntersectionService from '../intersection/intersection.service';
import LocomotiveService from '../locomotive/locomotive.service';
import LazyCache from './lazy.cache';

export default class LazyDirective extends Directive {

	onInit() {
		const { node } = getContext(this);
		node.classList.add('lazy');
		this.src$ = new Subject().pipe(
			distinctUntilChanged(),
			switchMap(src => {
				const data = LazyCache.get(src);
				if (data) {
					return of(data);
				}
				node.classList.remove('lazyed');
				return this.lazy$(src);
			}),
			takeUntil(this.unsubscribe$)
		);
		this.src$.subscribe(src => {
			LazyCache.set(this.lazy, src);
			node.setAttribute('src', src);
			node.classList.add('lazyed');
			LocomotiveService.instance$.pipe(
				first(),
				delay(10),
			).subscribe(instance => instance.update());
		});
	}

	onChanges() {
		this.src$.next(this.lazy);
	}

	lazy$(src) {
		const { node } = getContext(this);
		return IntersectionService.firstIntersection$(node).pipe(
			// tap(entry => console.log(entry)),
			switchMap(() => ImageService.load$(src)),
			takeUntil(this.unsubscribe$),
		);
	}

}

LazyDirective.meta = {
	selector: '[lazy],[[lazy]]',
	inputs: ['lazy']
};
