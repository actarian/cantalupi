import { Directive, getContext } from 'rxcomp';
import { takeUntil } from 'rxjs/operators';
import IntersectionService from '../intersection/intersection.service';

export default class AppearDirective extends Directive {

	onInit() {
		const { node } = getContext(this);
		node.classList.add('appear');
	}

	onChanges() {
		if (!this.appeared) {
			this.appeared = true;
			const { node } = getContext(this);
			IntersectionService.firstIntersection$(node).pipe(
				takeUntil(this.unsubscribe$),
			).subscribe(src => {
				node.classList.add('appeared');
			});
		}
	}

}

AppearDirective.meta = {
	selector: '[appear]',
};
