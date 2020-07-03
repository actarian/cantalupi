import { merge } from 'rxjs';
import { auditTime, map, tap } from 'rxjs/operators';
import LocationService from '../location/location.service';
import FilterMenuItem from './filter-menu-item';

export default class FilterMenuService {

	constructor() {
		this.filters = [];
	}

	init(tree, initialParams, callback) {
		this.filters = Array.isArray(tree) ? tree.map(x => new FilterMenuItem(x)) : [];
		this.flat = this.flatMap(this.filters);
		if (typeof callback === 'function') {
			this.flat.forEach(x => callback(x));
		}
		// console.log(this.flat);
		this.deserialize(this.filters, initialParams);
		this.toggleSelectedAndActiveStates(this.filters);
		return this.filters;
	}

	items$(filters, items, callback) {
		filters = this.init(filters, null, callback);
		const changes = filters.map(x => x.change$);
		return merge(...changes).pipe(
			auditTime(1),
			// tap(() => console.log(filters)),
			tap(() => this.serialize(filters)),
			map(() => this.filterItems(items)),
			tap(() => this.updateFilterStates(this.flat, items)),
			tap(() => this.toggleSelectedStates(filters)), // forza apertura menu
		);
	}

	flatMap(filters, items) {
		items = items || [];
		filters.forEach(x => {
			if (x instanceof FilterMenuItem) {
				items.push(x);
			}
			if (x.options) {
				this.flatMap(x.options, items);
			}
		});
		return items;
	}

	filterItems(items, skipFilter) {
		// const filters = Object.keys(this.filters).map((x) => this.filters[x]).filter(x => x.value !== null);
		// const filters = this.flat.filter(x => x.values && x.values.length > 0);
		// console.log(this.filters);
		const filters = this.filters.filter(x => x.values && x.values.length > 0);
		/*
		if (!skipFilter) {
			console.log('cycles', filters.length, 'x', items.length, '=', filters.length * items.length);
		}
		*/
		if (filters.length) {
			// console.log('filters', filters);
			return items.filter(item => {
				let has = true;
				filters.forEach(filter => {
					if (filter !== skipFilter) {
						has = has && filter.match(item);
					}
				});
				return has;
			});
		} else {
			return items.slice();
		}
	}

	updateFilterStates(filters, items) {
		// console.log(filters);
		filters.forEach(filter => {
			const filteredItems = this.filterItems(items, filter.parent ? filter.parent : filter);
			filter.options.forEach(option => {
				let count = 0;
				if (option.value) {
					let i = 0;
					while (i < filteredItems.length) {
						const item = filteredItems[i];
						if (filter.filter(item, option.value)) {
							count++;
						}
						i++;
					}
				} else {
					count = filteredItems.length;
				}
				// console.log(count);
				option.count = count;
				option.disabled = count === 0;
			});
		});
	}

	deserialize(filters, initialParams) {
		let params;
		if (initialParams && this.getParamsCount(initialParams)) {
			params = initialParams;
		}
		const locationParams = LocationService.deserialize('filters');
		if (locationParams && this.getParamsCount(locationParams)) {
			params = locationParams;
		}
		if (params) {
			filters.forEach(filter => {
				filter.values_ = params[filter.key + '-' + filter.value] || [];
				// console.log('deserialize', filter.key + '-' + filter.value, filter.values_);
			});
		}
		return filters;
	}

	toggleSelectedAndActiveStates(filters, parent) {
		let selected = false;
		if (filters) {
			selected = filters.reduce((p, c) => {
				const childSelected = this.toggleSelectedAndActiveStates(c.options, c);
				return p || Boolean(parent && parent.has(c)) || childSelected;
			}, false);
		}
		if (parent) {
			parent.selected = selected;
			parent.active = selected;
		}
		return selected;
	}

	toggleSelectedStates(filters, parent) {
		let selected = false;
		if (filters) {
			selected = filters.reduce((p, c) => {
				const childSelected = this.toggleSelectedStates(c.options, c);
				return p || Boolean(parent && parent.has(c)) || childSelected;
			}, false);
		}
		if (parent) {
			parent.selected = selected;
		}
		return selected;
	}

	serialize(filters) {
		let params = {};
		let any = false;
		filters.forEach((filter) => {
			if (filter.values && filter.values.length > 0) {
				params[filter.key + '-' + filter.value] = filter.values;
				// console.log('serialize', filter.values);
				any = true;
			}
		});
		if (!any) {
			params = null;
		}
		// console.log('FilterMenuService.serialize', params);
		LocationService.serialize('filters', params);
		return params;
	}

	getParamsCount(params) {
		if (params) {
			const paramsCount = Object.keys(params).reduce((p, c, i) => {
				const values = params[c];
				return p + (values ? values.length : 0);
			}, 0);
			return paramsCount;
		} else {
			return 0;
		}
	}

}
