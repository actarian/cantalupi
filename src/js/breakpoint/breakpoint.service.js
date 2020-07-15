import { combineLatest, concat, Observable } from 'rxjs';
import { debounceTime, map, skip, startWith, take, takeUntil } from 'rxjs/operators';
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
	// observable;
	// mql;
}

export class BreakpointService {

	isMatched(value) {
		const queries = this.splitQueries(coerceArray(value));
		return queries.some(mediaQuery => this._registerQuery(mediaQuery).mql.matches);
	}

	observe(value) {
		const queries = this.splitQueries(coerceArray(value));
		const observables = queries.map(query => this._registerQuery(query).observable);
		let stateObservable = combineLatest(observables);
		stateObservable = concat(
			stateObservable.pipe(take(1)),
			stateObservable.pipe(skip(1), debounceTime(0)));
		return stateObservable.pipe(map((breakpointStates) => {
			const response = {
				matches: false,
				breakpoints: {},
			};
			breakpointStates.forEach((state) => {
				response.matches = response.matches || state.matches;
				response.breakpoints[state.query] = state.matches;
			});
			return response;
		}));
	}

	static _registerQuery(query) {
		if (this._queries.has(query)) {
			return this._queries.get(query);
		}
		const mql = MediaMatcher.matchMedia(query);
		const queryObservable = new Observable((observer) => {
			const handler = (e) => this._zone.run(() => observer.next(e));
			mql.addListener(handler);

			return () => {
				mql.removeListener(handler);
			};
		}).pipe(
			startWith(mql),
			map((nextMql) => ({ query, matches: nextMql.matches })),
			takeUntil(this._destroySubject)
		);
		const output = { observable: queryObservable, mql };
		this._queries.set(query, output);
		return output;
	}

	static splitQueries(queries) {
		return queries.map((query) => query.split(','))
			.reduce((a1, a2) => a1.concat(a2))
			.map(query => query.trim());
	}
}
