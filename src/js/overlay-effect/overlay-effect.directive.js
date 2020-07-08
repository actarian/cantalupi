import { Directive, getContext } from 'rxcomp';
import { animationFrame, fromEvent, interval, of } from 'rxjs';
import { map, startWith, takeUntil, withLatestFrom } from 'rxjs/operators';
import LocomotiveService from '../locomotive/locomotive.service';

export class OverlayLerp {

	constructor() {
		this.x = this.ex = window.innerWidth / 2;
		this.y = this.ey = window.innerHeight / 2;
		this.dy = 0;
	}

	tick(event) {
		if (event.clientX) {
			const inertia = this.inertia ? Number(this.inertia) : 0.01;
			const dy = 0; // this.dy;
			this.ex = event.clientX;
			this.ey = event.clientY;
			this.x += (this.ex - this.x) * inertia;
			this.y += ((this.ey + dy) - this.y) * inertia;
		}
	}

}

export default class OverlayEffectDirective extends Directive {

	onInit() {
		this.raf$ = interval(0, animationFrame);
		this.move$ = fromEvent(document, 'mousemove');
		this.lerp = new OverlayLerp();
		const { node } = getContext(this);
		this.animation$().pipe(
			takeUntil(this.unsubscribe$)
		).subscribe((lerp) => {
			node.style.transform = `translate3d(${lerp.x}px,${lerp.y}px,0px)`;
		});
		LocomotiveService.scroll$.pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(event => {
			this.lerp.dy = event.scroll.y;
		});
	}

	animation$() {
		return this.raf$.pipe(
			withLatestFrom(this.move$),
			map(latest => {
				const lerp = this.lerp;
				lerp.tick(latest[1]);
				return lerp;
			}),
			startWith(this.lerp)
		);
	}
}

OverlayEffectDirective.meta = {
	selector: `[overlay-effect]`,
	inputs: ['inertia']
};

OverlayEffectDirective.rafWindow = of (animationFrame);
