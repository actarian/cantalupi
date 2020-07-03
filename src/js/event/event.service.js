import { of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import ApiService from '../api/api.service';
import FavouriteService from '../favourite/favourite.service';
import QuestionService from '../question/question.service';
import UserService from '../user/user.service';
import { FAKE_FILTERS } from './fake-filters';

export class Event {

	get live() {
		return this.info.started && !this.info.ended;
	}

	get incoming() {
		const now = new Date();
		const diff = this.startDate - now;
		const hoursDiff = Math.floor(diff / 1000 / 60 / 60);
		return !this.info.started && this.startDate > now && hoursDiff < 24;
	}

	get future() {
		const now = new Date();
		return !this.info.started && this.startDate > now;
	}

	get past() {
		return this.info.ended;
	}

	get hasRelated() {
		return this.related && this.related.length;
	}

	constructor(data, isStatic) {
		if (data) {
			Object.assign(this, data);
			this.info = this.info || {};
			if (this.creationDate) {
				this.creationDate = new Date(this.creationDate);
			}
			if (this.startDate) {
				this.startDate = new Date(this.startDate);
				this.info.started = this.startDate < Date.now();
			}
			if (this.endDate) {
				this.endDate = new Date(this.endDate);
				if (this.endDate < Date.now()) {
					this.info.ended = true;
				} else {
					this.endDate = null;
				}
			}
			if (this.related) {
				this.related = EventService.mapEvents(this.related, isStatic);
			}
			if (this.questions) {
				this.questions = QuestionService.mapQuestions(this.questions, isStatic);
			}
		}
	}
}

export default class EventService {

	static detail$(eventId) {
		//return ApiService.staticGet$(`/event/${1001}/detail`).pipe(
		return ApiService.get$(`/event/${eventId}/detail`).pipe(
			tap(response => response.data.id = parseInt(eventId)), // !!!
			map(response => EventService.mapEvent(response.data, response.static))
		);
	}

	static listing$(eventId) {
		// return ApiService.staticGet$(`/event/${1001}/listing`).pipe(
		return ApiService.get$(`/event/${eventId}/listing`).pipe(
			switchMap(response => EventService.mapListing(response.data, response.static, eventId))
		);
	}

	static filter$(eventId) {
		return ApiService.get$(`/channel/filter`).pipe(map(response => response.data));
		//return ApiService.staticGet$(`/event/${1001}/filter`).pipe(map(response => response.data));
	}

	static top$() {
		//return ApiService.staticGet$(`/event/evidence`).pipe(
		return ApiService.get$(`/event/evidence`).pipe(
			map(response => EventService.mapEvents(response.data, response.static))
		);
	}

	static upcoming$() {
		return ApiService.get$(`/event/upcoming`).pipe(
			map(response => EventService.mapEvents(response.data, response.static))
		);
	}

	static subscribe$(eventId) {
		return of(null);
	}

	static unsubscribe$(eventId) {
		return of(null);
	}

	static like$(eventId) {
		return of(null);
	}

	static unlike$(eventId) {
		return of(null);
	}

	static postQuestion$(event, body) {
		//const eventId = 1001; // event.id !!!
		//return ApiService.staticPost$(`/event/${eventId}/question`, body).pipe(
		return ApiService.post$(`/event/${event.id}/question`, body).pipe(
			map(response => {
				const question = QuestionService.mapQuestion(response.data, response.static);
				if (response.static) {
					question.id = event.questions[0].id + 1;
					question.creationDate = new Date();
					question.user = UserService.getCurrentUser();
					question.body = body;
				}
				return question;
			}),
		);
	}

	static mapEvent(event, isStatic) {
		return isStatic ? EventService.fake(new Event(event, true)) : new Event(event);
	}

	static mapEvents(events, isStatic) {
		return events ? events.map(x => EventService.mapEvent(x, isStatic)) : [];
	}

	static mapListing(items, isStatic, eventId) {
		if (isStatic) {
			return EventService.fakeListing(eventId);
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
		// !!! todo, wrap static api response { static: true, data: ... }
		// console.log('EventService.fake', item);
		const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'L', 'M'];
		const index = item.id % 1000;
		const channelId = 100 + (item.id - index) / 1000;
		item.url = `${item.url}?eventId=${item.id}`;
		if (item.channel) {
			item.channel.id = channelId;
			item.channel.url = `${item.channel.url}?channelId=${item.channel.id}`;
			const channelIndex = item.channel.id % 100;
			item.channel.name = `Channel ${letters[channelIndex - 1]}`;
			item.name = `Event ${letters[channelIndex - 1]}${index}`;
		}
		if (item.info) {
			item.info.subscribers = 50 + Math.floor(Math.random() * 200);
			item.info.likes = 50 + Math.floor(Math.random() * 200);
			item.media = {
				src: 'https://gruppoconcorde-view.thron.com/api/xcontents/resources/delivery/getContentDetail?clientId=gruppoconcorde&xcontentId=16ef3c0a-ba0c-4e3a-a10a-32bc7f9a4297&pkey=yz1hpd',
				type: 'thron'
			};
			const now = new Date();
			switch (index) {
				case 1:
					item.startDate = new Date(new Date().setMinutes(now.getMinutes() - 10));
					item.endDate = null;
					item.info.started = true;
					item.info.ended = false;
					break;
				case 2:
					item.startDate = new Date(new Date().setMinutes(now.getMinutes() + 2));
					item.endDate = null;
					item.info.started = false;
					item.info.ended = false;
					break;
				case 3:
					item.startDate = new Date(new Date().setHours(now.getHours() + 2));
					item.endDate = null;
					item.info.started = false;
					item.info.ended = false;
					break;
				case 4:
					item.startDate = new Date(new Date().setHours(now.getHours() - 7));
					item.endDate = new Date(new Date().setHours(now.getHours() - 6));
					item.info.started = true;
					item.info.ended = true;
					break;
				case 5:
					item.startDate = new Date(new Date().setDate(now.getDate() + 7));
					item.endDate = null;
					item.info.started = false;
					item.info.ended = false;
					break;
				case 6:
					item.startDate = new Date(new Date().setDate(now.getDate() + 14));
					item.endDate = null;
					item.info.started = false;
					item.info.ended = false;
					break;
				default:
					item.startDate = new Date(new Date().setDate(now.getDate() - 14 - Math.floor(Math.random() * 150)));
					item.endDate = new Date(new Date(item.startDate.getTime()).setHours(item.startDate.getHours() + 1));
					item.info.started = true;
					item.info.ended = true;
			}
			const subscriptions = FavouriteService.getCurrentSubscriptions();
			const subscription = subscriptions.find(x => x.id === item.id);
			item.info.subscribed = subscription !== undefined;

			const likes = FavouriteService.getCurrentLikes();
			const like = likes.find(x => x.id === item.id);
			item.info.liked = like !== undefined;

			const favourites = FavouriteService.getCurrentFavourites();
			const favourite = favourites.find(x => x.id === item.id);
			item.info.saved = favourite !== undefined;
		}
		item.features = [];
		const filters = FAKE_FILTERS;
		filters.forEach(filter => {
			const index = Math.floor(Math.random() * filter.options.length);
			item.features.push(filter.options[index].value);
		});
		if (item.related) {
			item.related = item.related.filter(x => (x.id !== item.id) && (x.live || x.incoming || x.past));
		}
		return item;
	}

	static fakeListing(eventId) {
		const index = eventId % 1000;
		const channelId = 100 + (eventId - index) / 1000;
		eventId = 1001;
		return ApiService.staticGet$(`/event/${eventId}/detail`).pipe(
			map(response => {
				const channel_ = new Event(response.data, true).channel;
				channel_.id = channelId;
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
					url: '/cantalupi/events-category.html',
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
					url: '/cantalupi/events-document.html',
					picture: image_,
					category: category_,
				};
				const product_ = {
					id: 1000,
					type: 'product',
					name: 'Product',
					title: 'Product',
					abstract: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget dolor tincidunt, lobortis dolor eget, condimentum libero.</p>',
					url: '/cantalupi/events-product.html',
					picture: image_,
					category: category_,
				};
				const magazine_ = {
					id: 1000,
					type: 'magazine',
					name: 'Magazine',
					title: 'Magazine',
					abstract: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget dolor tincidunt, lobortis dolor eget, condimentum libero.</p>',
					url: '/cantalupi/events-product.html',
					picture: image_,
					category: category_,
				};
				const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'L', 'M'];
				return new Array(30).fill(true).map((x, i) => {
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
					item.id = (channel_.id - 100) * 1000 + 1 + i;
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
		);
	}

	static fakeSaved(items) {
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
		};
		const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'L', 'M'];
		return items.map((x, i) => {
			let type = 'event';
			let item = Object.assign({}, event_);
			item.id = x.id;
			item.name = item.title = `${item.name} ${letters[(item.id - 1) % 10]}`;
			const index = x.id % 1000;
			item.channel = { id: (x.id - index) / 1000 + 1000 };
			item.type = type;
			item.picture = Object.assign({}, image_, {
				id: (100001 + i),
				width: 700,
				height: [700, 900, 1100][i % 3],
			});
			item.info = Object.assign({}, info_);
			item = EventService.fake(new Event(item, true));
			return item;
		});
	}

}
