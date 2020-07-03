import { Directive, getContext } from 'rxcomp';
import { takeUntil } from 'rxjs/operators';
import LocomotiveService from './locomotive.service';

export default class LocomotiveDirective extends Directive {
	onInit() {
		const { node } = getContext(this);
		LocomotiveService.locomotive$(node).pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(scroll => this.scroll = scroll);
	}
}

LocomotiveDirective.meta = {
	selector: '[locomotive]',
};
