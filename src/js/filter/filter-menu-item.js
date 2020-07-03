// import FilterItem, { FilterMode } from './filter-item';
import { BehaviorSubject } from 'rxjs';
import { FilterMode } from './filter-item';

export default class FilterMenuItem {

	/*
	constructor(filter, parent) {
		filter.mode = filter.mode || FilterMode.OR;
		filter.options = filter.options ? filter.options.map(x => x.options ? new FilterMenuItem(x, parent || this) : x) : [];
		super(filter);
	}
	*/

	get values() {
		return this.parent ? this.parent.values : this.values_;
	}

	get change$() {
		if (this.parent) {
			return this.parent.change$;
		} else if (!this.change$_) {
			this.change$_ = new BehaviorSubject();
		}
		return this.change$_;
	}

	constructor(filter, parent) {
		// this.change$ = new BehaviorSubject();
		this.mode = FilterMode.SELECT;
		this.placeholder = 'Select';
		this.values_ = [];
		this.options = [];
		this.items = [];
		if (filter) {
			filter.mode = filter.mode || FilterMode.OR;
			filter.options = filter.options ? filter.options.map(x => x.options ? new FilterMenuItem(x, parent || this) : x) : [];
			if (filter.mode === FilterMode.SELECT) {
				filter.options.unshift({
					label: filter.placeholder,
					values: [],
				});
			}
			Object.assign(this, filter);
		}
		this.parent = parent;
		if (parent) {
			parent.items.push.apply(parent.items, this.options);
		}
	}

	filter(item, value) {
		return true; // item.options.indexOf(value) !== -1;
	}

	match(item) {
		let match;
		if (this.mode === FilterMode.OR) {
			match = this.values.length ? false : true;
			this.values.forEach(value => {
				match = match || this.filter(item, value);
			});
		} else {
			match = true;
			this.values.forEach(value => {
				match = match && this.filter(item, value);
			});
		}
		return match;
	}

	getLabel() {
		if (this.mode === FilterMode.SELECT) {
			return this.placeholder || this.label;
		} else {
			return this.label;
		}
	}

	has(item) {
		return this.values.indexOf(item.value) !== -1;
	}

	set(item) {
		if (this.mode === FilterMode.SELECT) {
			this.values_ = [];
		}
		const index = this.values.indexOf(item.value);
		if (index === -1) {
			if (item.value !== undefined) {
				this.values.push(item.value);
			}
		}
		if (this.mode === FilterMode.SELECT) {
			this.placeholder = item.label;
		}
		// console.log('FilterItem.set', item);
		this.change$.next();
	}

	remove(item) {
		const index = this.values.indexOf(item.value);
		if (index !== -1) {
			this.values.splice(index, 1);
		}
		if (this.mode === FilterMode.SELECT) {
			const first = this.options[0];
			this.placeholder = first.label;
		}
		// remove all child items
		if (item instanceof FilterMenuItem) {
			item.options.forEach(x => item.remove(x));
		}
		// console.log('FilterItem.remove', item);
		this.change$.next();
	}

	toggle(item) {
		if (this.has(item)) {
			this.remove(item);
		} else {
			this.set(item);
		}
	}

	toggleActive() {
		this.active = !this.active;
	}

	isMenuItem(option) {
		return option instanceof FilterMenuItem;
	}

}
