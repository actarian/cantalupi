import { of } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import ApiService from '../api/api.service';
import EventService, { Event } from '../event/event.service';
import { FAKE_FILTERS } from '../event/fake-filters';

export class Channel {
	constructor(data, isStatic) {
		if (data) {
			Object.assign(this, data);
			this.events = EventService.mapEvents(this.events, isStatic);
		}
	}
}

export default class ChannelService {

	static channels$() {
		return ApiService.get$(`/channel/channels`).pipe(
			map(response => ChannelService.mapChannels(response.data, response.static))
		);
	}

	static detail$(channelId) {
		return ApiService.get$(`/channel/${channelId}/detail`).pipe(
			map(response => ChannelService.mapChannel(response.data, response.static))
		);
	}

	static listing$(channelId) {
		//return ApiService.staticGet$(`/channel/${101}/listing`).pipe(
		return ApiService.get$(`/channel/${channelId}/listing`).pipe(
			switchMap(response => ChannelService.mapListing(response.data, response.static, channelId))
		);
	}

	static filter$(channelId) {
		//return ApiService.get$(`/channel/${channelId}/filter`).pipe(
		//	map(response => response.data)
		//);
		return ApiService.get$(`/channel/filter`).pipe(map(response => response.data));
		//return ApiService.staticGet$(`/event/${1001}/filter`).pipe(map(response => response.data));
	}

	static top$() {
		return ApiService.get$(`/channel/evidence`).pipe(
			map(response => ChannelService.mapChannels(response.data, response.static))
		);
	}

	static subscribe$(channelId) {
		return of(null);
	}

	static unsubscribe$(channelId) {
		return of(null);
	}

	static like$(channelId) {
		return of(null);
	}

	static unlike$(channelId) {
		return of(null);
	}

	static mapChannel(channel, isStatic) {
		return isStatic ? ChannelService.fake(new Channel(channel, true)) : new Channel(channel);
	}

	static mapChannels(channels, isStatic) {
		return channels ? channels.map(x => ChannelService.mapChannel(x, isStatic)) : [];
	}

	static mapListing(items, isStatic, channelId) {
		if (isStatic) {
			return ChannelService.fakeListing(101);
		} else {
			return of(items.map(item => {
				if (item.type === 'event') {
					return EventService.mapEvent(item);
				} else {
					return item;
				}
			}));
		}
	}

	static fake(item) {
		// console.log('ChannelService.fake', item);
		item.url = `${item.url}?channelId=${item.id}`;
		item.info.subscribers = 1500 + Math.floor(Math.random() * 200);
		item.info.likes = 500 + Math.floor(Math.random() * 200);
		return item;
	}

	static fakeListing(channelId) {
		return ApiService.staticGet$(`/channel/${channelId}/detail`).pipe(
			map(response => {
				const channel_ = ChannelService.fake(new Channel(response.data, true));
				const info_ = {
					started: false,
					ended: false,
					subscribers: 100,
					subscribed: false,
					likes: 100,
					liked: false
				};
				const image_ = {
					id: 100000,
					width: 700,
					height: 700,
					src: 'https://source.unsplash.com/random/',
				};
				const category_ = {
					id: 10000,
					name: 'Category',
					url: '/cantalupi/category.html',
				};
				const event_ = {
					id: 1000,
					type: 'event',
					name: 'Evento',
					title: 'Evento',
					abstract: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget dolor tincidunt, lobortis dolor eget, condimentum libero.</p>',
					url: '/cantalupi/events-event.html',
					creationDate: '2020-05-20T08:11:17.827Z',
					startDate: '2020-05-20T08:11:17.827Z',
					picture: image_,
					info: info_,
					channel: channel_,
				};
				const picture_ = {
					id: 1000,
					type: 'picture',
					name: 'Picture',
					title: 'Picture',
					abstract: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget dolor tincidunt, lobortis dolor eget, condimentum libero.</p>',
					url: '/cantalupi/document.html',
					picture: image_,
					category: category_,
				};
				const product_ = {
					id: 1000,
					type: 'product',
					name: 'Product',
					title: 'Product',
					abstract: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget dolor tincidunt, lobortis dolor eget, condimentum libero.</p>',
					url: '/cantalupi/product.html',
					picture: image_,
					category: category_,
				};
				const magazine_ = {
					id: 1000,
					type: 'magazine',
					name: 'Magazine',
					title: 'Magazine',
					abstract: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget dolor tincidunt, lobortis dolor eget, condimentum libero.</p>',
					url: '/cantalupi/product.html',
					picture: image_,
					category: category_,
				};
				const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'L', 'M'];
				return new Array(250).fill(true).map((x, i) => {
					let type = 'event';
					if (i > 3) {
						if (i % 5 === 0) {
							type = 'picture';
						}
						if (i % 7 === 0) {
							type = 'product';
						}
						if (i % 11 === 0) {
							type = 'magazine';
						}
					}
					let item;
					switch (type) {
						case 'picture':
							item = Object.assign({}, picture_);
							break;
						case 'product':
							item = Object.assign({}, product_);
							break;
						case 'magazine':
							item = Object.assign({}, magazine_);
							break;
						case 'event':
							item = Object.assign({}, event_);
							break;
					}
					item.id = (channelId - 100) * 1000 + 1 + i;
					item.name = item.title = `${item.name} ${letters[(item.id - 1) % 10]}`;
					item.type = type;
					if (item.picture) {
						item.picture = Object.assign({}, image_, {
							id: (100001 + i),
							width: 700,
							height: [700, 900, 1100][i % 3],
						});
					}
					if (item.info) {
						item.info = Object.assign({}, info_);
					}
					if (item.channel) {
						item.channel = Object.assign({}, channel_);
					}
					if (item.category) {
						const categoryId = (10001 + (i % 10));
						item.category = Object.assign({}, category_, {
							id: categoryId,
							name: 'Category ' + letters[categoryId % 10],
							url: `${category_.url}?categoryId=${categoryId}`,
						});
					}
					switch (type) {
						case 'event':
							item = EventService.fake(new Event(item, true));
							break;
						default:
							item.features = [];
							const filters = FAKE_FILTERS;
							filters.forEach(filter => {
								const index = Math.floor(Math.random() * filter.options.length);
								item.features.push(filter.options[index].value);
							});
					}
					return item;
				});
			})
			// map(x => new Channel(x))
		);
	}

}

ChannelService.channels$ = ChannelService.channels$().pipe(shareReplay(1));
