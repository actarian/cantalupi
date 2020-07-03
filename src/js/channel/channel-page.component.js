import { combineLatest } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import FilterItem from '../filter/filter-item';
import FilterService from '../filter/filter.service';
import LocationService from '../location/location.service';
import PageComponent from '../page/page.component';
import ChannelService from './channel.service';

export default class ChannelPageComponent extends PageComponent {

	onInit() {
		this.grid = {
			mode: 1,
			width: 350,
			gutter: 2,
		};
		this.channels = null;
		this.channel = null;
		this.listing = null;
		this.filters = null;
		this.secondaryFiltersVisible = false;
		this.secondaryFilters = null;
		this.activeFilters = null;
		this.filteredItems = [];
		this.load$().pipe(
			first(),
		).subscribe(data => {
			this.channels = data[0];
			this.channel = data[1];
			this.listing = data[2];
			this.setFilters(data[3]);
			this.startFilter(this.listing);
			this.pushChanges();
		});
	}

	load$() {
		const channelId = LocationService.get('channelId');
		return combineLatest(
			ChannelService.channels$,
			ChannelService.detail$(channelId),
			ChannelService.listing$(channelId),
			ChannelService.filter$(channelId),
		);
	}

	setFilters(filters) {
		const filterObject = {
			type: {
				label: 'Type',
				mode: 'select',
				options: [{
					value: 'event',
					label: 'Event',
				}, {
					value: 'picture',
					label: 'Picture',
				}, {
					value: 'product',
					label: 'Product',
				}, {
					value: 'magazine',
					label: 'Magazine',
				}]
			},
		};
		filters.forEach(filter => {
			filter.mode = 'or';
			filterObject[filter.key] = filter;
		});
		const filterService = this.filterService = new FilterService(filterObject, {}, (key, filter) => {
			switch (key) {
				case 'type':
					filter.filter = (item, value) => {
						return item.type === value;
					};
					break;
				case 'tag':
					filter.filter = (item, value) => {
						return item.tags.indexOf(value) !== -1;
					};
					break;
				default:
					filter.filter = (item, value) => {
						return item.features.indexOf(value) !== -1;
					};
			}
		});
		this.filters = filterService.filters;
		this.secondaryFilters = Object.keys(this.filters).filter(key => key !== 'type').map(key => {
			return this.filters[key];
		});
	}

	startFilter(items) {
		this.filterService.items$(items).pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(filteredItems => {
			this.filteredItems = [];
			this.activeFilters = [];
			this.pushChanges();
			setTimeout(() => {
				this.filteredItems = filteredItems;
				this.activeFilters = this.secondaryFilters.map(f => {
					f = new FilterItem(f);
					f.options = f.options.filter(o => f.has(o));
					return f;
				}).filter(f => f.options.length);
				this.pushChanges();
			}, 1);
			// console.log('ChannelPageComponent.filteredItems', filteredItems.length);
		});
	}

	toggleGrid() {
		this.grid.width = this.grid.width === 350 ? 525 : 350;
		this.pushChanges();
	}

	toggleFilters() {
		this.secondaryFiltersVisible = !this.secondaryFiltersVisible;
		this.pushChanges();
	}

}

ChannelPageComponent.meta = {
	selector: '[channel-page]',
};
