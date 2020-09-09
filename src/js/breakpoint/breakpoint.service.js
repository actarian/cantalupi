import { combineLatest, concat, Observable } from 'rxjs';
import { debounceTime, map, skip, startWith, take } from 'rxjs/operators';
import { MediaMatcher } from './media-matcher';

export class BreakpointState {
	// matches;
	// breakpoints;
}

class InternalBreakpointState {
	// matches;
	// query;
}

class Query {
	// query$;
	// mediaQueryList;
}

export class BreakpointService {

	static queries_ = {};

	static observe$(value) {
		const queries = Object.assign({}, value); // this.splitQueries(coerceArray(value));
		let queries$_ = [];
		Object.keys(queries).forEach(key => {
			const query = queries[key];
			const group = query.split('and').map(query => query.trim());
			group.forEach(query => queries$_.push(this.registerQuery$_(query).query$));
			queries[key] = { query, group };
		});
		// let queries$_ = Object.keys(queries).map(key => this.registerQuery$_(queries[key]).query$);
		queries$_ = combineLatest(...queries$_);
		let queries$ = concat(
			queries$_.pipe(take(1)),
			queries$_.pipe(skip(1), debounceTime(0))
		);
		return queries$.pipe(
			map((breakpoints) => {
				const response = {};
				breakpoints.forEach(b => {
					Object.keys(queries).forEach(key => {
						const query = queries[key];
						const match = query.group.reduce((p, c) => {
							return p && (b.query !== c || b.matches);
						}, true);
						response[key] = match;
					});
				});
				/*
				const response = {
					matches: false,
					breakpoints: {},
				};
				breakpoints.forEach((state) => {
					response.matches = response.matches || state.matches;
					response.breakpoints[state.query] = state.matches;
				});
				console.log(breakpoints, response, queries);
				*/
				return response;
			}),
		);
	}

	/*
	static isMatched$(value) {
		const queries = this.splitQueries(coerceArray(value));
		return queries.some(mediaQuery => this.registerQuery$_(mediaQuery).mediaQueryList.matches);
	}
	*/

	static has(query) {
		return this.queries_[query] !== undefined;
	}

	static get(query) {
		return this.queries_[query];
	}

	static set(query, value) {
		return this.queries_[query] = value;
	}

	static registerQuery$_(key) {
		if (this.has(key)) {
			return this.get(key);
		}
		const mediaQueryList = MediaMatcher.matchMedia(key);
		const query$ = new Observable((observer) => {
			const handler = (e) => observer.next(e);
			mediaQueryList.addListener(handler);
			return () => {
				mediaQueryList.removeListener(handler);
			};
		}).pipe(
			startWith(mediaQueryList),
			map((nextMediaQueryList) => ({ query: key, matches: nextMediaQueryList.matches })),
		);
		const output = { query$: query$, mediaQueryList };
		this.set(key, output);
		return output;
	}

	static splitQueries(queries) {
		return queries.map((query) => query.split(','))
			.reduce((a1, a2) => a1.concat(a2))
			.map(query => query.trim());
	}
}
