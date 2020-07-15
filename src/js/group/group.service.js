import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { BreakpointService } from '../breakpoint/breakpoint.service';

export class GroupService {

	static group$(items, query = 3) {
		if (typeof query === 'number') {
			return of(this.groupItems(items, query));
		} else {
			const keys = Object.keys(query);
			return BreakpointService.observe(keys).pipe(
				map(result => {
					const length = keys.reduce((p, c, i) => {
						if (result.breakpoints[c]) {
							return query[c];
						} else {
							return p;
						}
					}, 1);
					return this.groupItems(items, length);
				})
			);
		}
		// return of(this.groupItems(items, length));
	}

	static groupItems(items, length = 3) {
		const group = [];
		let sub = [];
		items.forEach(item => {
			if (sub.length === length) {
				group.push(sub);
				sub = [];
			}
			sub.push(item);
		});
		if (sub.length) {
			group.push(sub);
		}
		return group;
	}

}
