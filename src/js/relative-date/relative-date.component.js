import { Directive, getContext } from 'rxcomp';
import { interval } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import RelativeDatePipe from './relative-date.pipe';

export default class RelativeDateDirective extends Directive {

	set text(text) {
		if (this.text_ !== text) {
			this.text_ = text;
			const { node } = getContext(this);
			node.innerText = text;
		}
	}

	onInit() {
		this.change$().pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(() => {
			this.text = RelativeDatePipe.transform(this.relativeDate);
		});
	}

	change$() {
		return interval(1000).pipe(
			startWith(0),
		);
	}

}

RelativeDateDirective.meta = {
	selector: '[relativeDate]',
	inputs: ['relativeDate']
};
