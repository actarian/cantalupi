import { combineLatest } from 'rxjs';
import { first, map, takeUntil } from 'rxjs/operators';
import ApiService from '../api/api.service';
import { FilterMode } from '../filter/filter-item';
import FilterService from '../filter/filter.service';
import PageComponent from '../page/page.component';

export default class NewsPageComponent extends PageComponent {

	onInit() {
		this.items = [];
		this.filters = {};
		this.filter = {};
		this.load$().pipe(
			first(),
		).subscribe(data => {
			this.items = data[0];
			this.filters = data[1];
			this.onLoad();
			this.pushChanges();
		});
	}

	load$() {
		return combineLatest(
			ApiService.get$('/news/all').pipe(map(response => response.data)),
			ApiService.get$('/news/filters').pipe(map(response => response.data)),
		);
	}

	onLoad() {
		const items = this.items;
		const filters = this.filters;
		Object.keys(filters).forEach(key => {
			filters[key].mode = FilterMode.SELECT;
		});
		const initialParams = {};
		const filterService = new FilterService(filters, initialParams, (key, filter) => {
			switch (key) {
				default:
					filter.filter = (item, value) => {
						switch (key) {
							case 'category':
								if (value === 'project') {
									return item[key].id === 102;
								} else {
									return item[key].id !== 102;
								}
								break;
							default:
							// return item.features.indexOf(value) !== -1;
						}
					};
			}
		});
		this.filterService = filterService;
		this.filters = filterService.filters;
		this.filter = this.filters.category;
		filterService.items$(items).pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(items => {
			this.items = items;
			this.pushChanges();
			// console.log('NewsPageComponent.items', items.length);
		});
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

	clearFilter(event, filter) {
		event.preventDefault();
		event.stopImmediatePropagation();
		filter.clear();
		this.pushChanges();
	}

	makeFake() {
		ApiService.get$('/news/all').pipe(
			first()
		).subscribe(response => {
			const filters = {};
			const addFilter = (key, valueOrArray) => {
				const filter = filters[key] ? filters[key] : (filters[key] = { label: key, placeholder: `Scegli ${key}`, mode: 'or', options: [] });
				valueOrArray = Array.isArray(valueOrArray) ? valueOrArray : [valueOrArray];
				valueOrArray.forEach(value => {
					if (!filter.options.find(x => x.value === value)) {
						filter.options.push({ label: value, value });
					}
				});
			};
			const items = response.data;
			items.forEach((x, i) => {
				const splitKeys = ['lumen', 'watt', 'material', 'mounting', 'area'];
				splitKeys.forEach(key => {
					if (x[key].indexOf('/') !== -1) {
						x[key] = x[key].split('/').map(x => x.trim());
					} else {
						x[key] = x[key].split(',').map(x => x.trim());
					}
				});
				for (var k in x) {
					if (['catalogue', 'category', 'menu'].indexOf(k) === -1 && typeof x[k] === 'string' && x[k].indexOf('/') !== -1) {
						console.log(k, x[k]);
					}
					if (['id', 'name', 'catalogue', 'category', 'menu'].indexOf(k) === -1) {
						addFilter(k, x[k]);
					}
				}
				x.id = 1000 + i + 1;
				x.url = '/cantalupi/exclusive-yachts-interiors-top-series.html';
				x.image = `/cantalupi/img/exclusive-yachts-exteriors/0${1 + x.id % 4}.jpg`;
				x.imageOver = `/cantalupi/img/exclusive-yachts-exteriors/01-over.jpg`;
				x.category = 'Exclusive Yachts Exteriors';
				x.title = x.name;
				x.description = x.plus;
				x.power = x.watt + ' W';
				x.lumen = x.lumen + ' lumen';
			});
			console.log('filters', filters, JSON.stringify(filters, null, 2));
			const yachtsExteriors = items.filter(x => x.yachts && x.category.indexOf('Exteriors') !== -1);
			const yachtsInteriors = items.filter(x => x.yachts && x.category.indexOf('Interiors') !== -1);
			const villasExteriors = items.filter(x => x.villas && x.category.indexOf('Exteriors') !== -1);
			const villasInteriors = items.filter(x => x.villas && x.category.indexOf('Interiors') !== -1);
			console.log('yachtsExteriors', yachtsExteriors, JSON.stringify(yachtsExteriors, null, 2));
			console.log('yachtsInteriors', yachtsInteriors, JSON.stringify(yachtsInteriors, null, 2));
			console.log('villasExteriors', villasExteriors, JSON.stringify(villasExteriors, null, 2));
			console.log('villasInteriors', villasInteriors, JSON.stringify(villasInteriors, null, 2));
		});
	}

}

NewsPageComponent.meta = {
	selector: '[news-page]',
};
