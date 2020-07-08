import { takeUntil } from 'rxjs/operators';
import { FilterMode } from '../filter/filter-item';
import FilterService from '../filter/filter.service';
import PageComponent from '../page/page.component';

export default class ProductsPageComponent extends PageComponent {

	onInit() {
		const initialParams = window.params || {};
		const items = this.items = window.products || [];
		const filters = window.filters || {};
		Object.keys(filters).forEach(key => {
			filters[key].mode = FilterMode.SELECT;
		});
		const filterService = new FilterService(filters, initialParams, (key, filter) => {
			switch (key) {
				/*
				case 'categories':
					filter.filter = (item, value) => {
						return item.category === value;
					};
					break;
					*/
				default:
					filter.filter = (item, value) => {
						return item.features.indexOf(value) !== -1;
					};
			}
		});
		filterService.items$(items).pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(items => {
			this.items = items;
			this.pushChanges();
			// console.log('MediaLibraryComponent.items', items.length);
		});
		this.filterService = filterService;
		this.filters = filterService.filters;
	}

	toggleFilter(filter) {
		Object.keys(this.filters).forEach(key => {
			const f = this.filters[key];
			if (f === filter) {
				f.active = !f.active;
			} else {
				f.active = false;
			}
		});
		this.pushChanges();
	}

}

ProductsPageComponent.meta = {
	selector: '[products-page]',
};
