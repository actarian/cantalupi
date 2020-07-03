import { BehaviorSubject } from 'rxjs';

export const FilterMode = {
	SELECT: 'select',
	AND: 'and',
	OR: 'or',
};

export default class FilterItem {

	constructor(filter) {
		this.change$ = new BehaviorSubject();
		this.mode = FilterMode.SELECT;
		this.placeholder = 'Select';
		this.values = [];
		this.options = [];
		if (filter) {
			if (filter.mode === FilterMode.SELECT) {
				filter.options.unshift({
					label: filter.placeholder,
					values: [],
				});
			}
			Object.assign(this, filter);
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

	getSelectedOption() {
		return this.options.find(x => this.has(x));
	}

	getLabel() {
		if (this.mode === FilterMode.SELECT) {
			const selectedOption = this.getSelectedOption();
			return selectedOption ? selectedOption.label : this.placeholder;
		} else {
			return this.label;
		}
	}

	has(item) {
		return this.values.indexOf(item.value) !== -1;
	}

	set(item) {
		if (this.mode === FilterMode.SELECT) {
			this.values = [];
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

}
