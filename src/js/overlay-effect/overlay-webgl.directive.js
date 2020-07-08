import { Directive, getContext } from 'rxcomp';
import { animationFrame, fromEvent, interval, of } from 'rxjs';
// import { map, startWith, withLatestFrom } from 'rxjs/operators';
import { map, startWith, takeUntil, withLatestFrom } from 'rxjs/operators';
import LocomotiveService from '../locomotive/locomotive.service';
import { FRAGMENT_SHADER_1, FRAGMENT_SHADER_2 } from './shader';

export class OverlayLerp {

	constructor() {
		this.w = window.innerWidth;
		this.h = window.innerHeight;
		this.x = this.ex = this.w / 2;
		this.y = this.ey = this.h / 2;
		this.speed = this.espeed = 0;
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
			this.speed += (this.espeed - this.speed) * 0.01;
		}
	}

	setSpeed(speed) {
		this.espeed = Math.abs(speed / 50);
	}

}

export default class OverlayWebglDirective extends Directive {

	onInit() {
		const lerp = this.lerp = new OverlayLerp();
		this.raf$ = interval(0, animationFrame);
		this.move$ = fromEvent(document, 'mousemove');
		const { node } = getContext(this);
		const canvas1 = document.createElement('canvas');
		node.appendChild(canvas1);
		const glsl1 = new window.glsl.Canvas(canvas1, {
			fragmentString: FRAGMENT_SHADER_1,
			premultipliedAlpha: false
		});
		const canvas2 = document.createElement('canvas');
		node.appendChild(canvas2);
		const glsl2 = new window.glsl.Canvas(canvas2, {
			fragmentString: FRAGMENT_SHADER_2,
			premultipliedAlpha: false
		});
		this.animation$().pipe(
			takeUntil(this.unsubscribe$)
		).subscribe((lerp) => {
			glsl1.setUniforms({
				'u_mx': lerp.x,
				'u_my': lerp.y,
				'u_speed': lerp.speed,
			});
			glsl2.setUniforms({
				'u_mx': lerp.x,
				'u_my': lerp.y,
				'u_speed': lerp.speed,
			});
		});
		LocomotiveService.scroll$.pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(event => {
			this.lerp.setSpeed(event.speed);
			this.lerp.dy = event.scroll.y;
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
}

OverlayWebglDirective.meta = {
	selector: `[overlay-webgl]`
};

OverlayWebglDirective.rafWindow = of (animationFrame);
