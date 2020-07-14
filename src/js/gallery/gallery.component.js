import { Component, getContext } from 'rxcomp';
import { animationFrame, fromEvent, interval } from 'rxjs';
import { map, startWith, takeUntil, withLatestFrom } from 'rxjs/operators';
import LocomotiveService from '../locomotive/locomotive.service';

export class GalleryLerp {

	constructor() {
		this.x = 0;
		this.y = 0;
		this.dy = 0;
	}

	tick(coords) {
		if (coords.x) {
			const inertia = this.inertia ? Number(this.inertia) : 0.01;
			this.x += (coords.x - this.x) * inertia;
			this.y += (coords.y + this.dy - this.y) * inertia;
		}
	}

}

export default class GalleryComponent extends Component {

	onInit() {
		const lerp = this.lerp = new GalleryLerp();
		this.raf$ = interval(0, animationFrame);
		const { node } = getContext(this);
		const buttonSpan = node.querySelector('.btn--gallery > span');
		let coords = { x: 0, y: 0 };
		this.move$ = fromEvent(window, 'mousemove').pipe(
			map(event => {
				coords.x = -window.innerWidth * 0.25 + event.clientX;
				coords.y = -window.innerWidth * 0.25 + event.clientY;
				return coords;
			})
		);
		LocomotiveService.scroll$.pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(event => {
			this.lerp.dy = event.scroll.y;
		});
		this.animation$().pipe(
			takeUntil(this.unsubscribe$)
		).subscribe((lerp) => {
			gsap.set(buttonSpan, {
				backgroundPosition: `${lerp.x}px ${lerp.y}px`,
			});
		});
	}

	animation$() {
		return this.raf$.pipe(
			withLatestFrom(this.move$),
			map(event => {
				const lerp = this.lerp;
				lerp.tick(event[1]);
				return lerp;
			}),
			startWith(this.lerp)
		);
	}

	onOpenGallery(event) {
		console.log('GalleryComponent.onOpenGallery');
		console.log(this.items);
	}
}

GalleryComponent.meta = {
	selector: '[gallery]',
	inputs: ['items']
};
