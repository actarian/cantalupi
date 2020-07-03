import { Component } from 'rxcomp';
import FilterMenuItem from './filter-menu-item';

export default class FilterMenuItemComponent extends Component {

	onInit() {
		// console.log('FilterMenuItemComponent.onInit', this);
	}

	toggleActive(option) {
		if (option instanceof FilterMenuItem) {
			option.toggleActive();
			this.pushChanges();
		} else {
			this.filter.toggle(option);
		}
	}

}

FilterMenuItemComponent.meta = {
	selector: '[menu-item]',
	inputs: ['filter', 'item'],
	template: /* html */ `
		<span class="option" [class]="{ active: filter.has(item), disabled: item.disabled, selected: item.selected }">
			<span class="checkbox" (click)="filter.toggle(item)"></span>
			<span class="name" [class]="{ menu: filter.isMenuItem(item), active: item.active }" (click)="toggleActive(item)" [innerHTML]="item.label"></span>
			<span class="count" [innerHTML]="item.count"></span>
		</span>
		<ul class="nav--options" *if="filter.isMenuItem(item) && (item.active)">
			<li class="nav--options__menu" menu-item [filter]="item" [item]="option" *for="let option of item.options"></li>
		</ul>
	`
};
