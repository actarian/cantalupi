import { BehaviorSubject } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import ApiService from '../api/api.service';
import EventService from '../event/event.service';
import LocalStorageService from '../storage/local-storage.service';

const subscriptions$_ = new BehaviorSubject([]);
const likes$_ = new BehaviorSubject([]);
const favourites$_ = new BehaviorSubject([]);

export default class FavouriteService {

	static getCurrentSubscriptions() {
		return subscriptions$_.getValue();
	}

	static getCurrentLikes() {
		return likes$_.getValue();
	}

	static getCurrentFavourites() {
		return favourites$_.getValue();
	}

	static subscriptions$() {
		return ApiService.staticGet$(`/user/subscription`).pipe(
			map(response => {
				if (response.static) {
					const subscriptions = LocalStorageService.get('subscriptions') || [];
					return EventService.fakeSaved(subscriptions);
				} else {
					return response.data;
				}
			}),
			switchMap(subscriptions => {
				subscriptions$_.next(subscriptions);
				return subscriptions$_;
			})
		);
	}

	static likes$() {
		return ApiService.staticGet$(`/user/like`).pipe(
			map(response => {
				if (response.static) {
					const likes = LocalStorageService.get('likes') || [];
					return EventService.fakeSaved(likes);
				} else {
					return response.data;
				}
			}),
			switchMap(likes => {
				likes$_.next(likes);
				return likes$_;
			})
		);
	}

	static favourites$() {
		return ApiService.get$(`/user/favourite`).pipe(
			map(response => EventService.mapEvents(response.data, response.static)),
			//map(response => {
			//	if (response.static) {
			//		const favourites = LocalStorageService.get('favourites') || [];
			//		return EventService.fakeSaved(favourites);
			//	} else {
			//		return response.data;
			//	}
			//}),
			switchMap(favourites => {
				favourites$_.next(favourites);
				return favourites$_;
			})
		);
	}

	static subscriptionAdd$(id) {
		return ApiService.staticPost$(`/user/subscription/add`, { id }).pipe(
			map(response => {
				if (response.static) {
					const subscriptions = LocalStorageService.get('subscriptions') || [];
					const item = subscriptions.find(x => x.id === id);
					if (!item) {
						subscriptions.unshift({ id });
					}
					subscriptions$_.next(subscriptions);
					LocalStorageService.set('subscriptions', subscriptions);
				}
				return response.data;
			}),
		);
	}

	static subscriptionRemove$(id) {
		return ApiService.staticPost$(`/user/subscription/remove`, { id }).pipe(
			map(response => {
				if (response.static) {
					const subscriptions = LocalStorageService.get('subscriptions') || [];
					const item = subscriptions.find(x => x.id === id);
					const index = item ? subscriptions.indexOf(item) : -1;
					if (index !== -1) {
						subscriptions.splice(index, 1);
					}
					subscriptions$_.next(subscriptions);
					LocalStorageService.set('subscriptions', subscriptions);
				}
				return response.data;
			}),
		);
	}

	static likeAdd$(id) {
		return ApiService.staticPost$(`/user/like/add`, { id }).pipe(
			map(response => {
				if (response.static) {
					const likes = LocalStorageService.get('likes') || [];
					const item = likes.find(x => x.id === id);
					if (!item) {
						likes.unshift({ id });
					}
					likes$_.next(likes);
					LocalStorageService.set('likes', likes);
				}
				return response.data;
			}),
		);
	}

	static likeRemove$(id) {
		return ApiService.staticPost$(`/user/like/remove`, { id }).pipe(
			map(response => {
				if (response.static) {
					const likes = LocalStorageService.get('likes') || [];
					const item = likes.find(x => x.id === id);
					const index = item ? likes.indexOf(item) : -1;
					if (index !== -1) {
						likes.splice(index, 1);
					}
					likes$_.next(likes);
					LocalStorageService.set('likes', likes);
				}
				return response.data;
			}),
		);
	}

	static favouriteAdd$(id) {
		return ApiService.post$(`/user/favourite/add`, { id }).pipe(
			map(response => {
				//if (response.static) {
				const favourites = LocalStorageService.get('favourites') || [];
				const item = favourites.find(x => x.id === id);
				if (!item) {
					favourites.unshift({ id });
				}
				favourites$_.next(favourites);
				LocalStorageService.set('favourites', favourites);
				//}
				return response.data;
			}),
		);
	}

	static favouriteRemove$(id) {
		return ApiService.post$(`/user/favourite/remove`, { id }).pipe(
			map(response => {
				//if (response.static) {
				const favourites = LocalStorageService.get('favourites') || [];
				const item = favourites.find(x => x.id === id);
				const index = item ? favourites.indexOf(item) : -1;
				if (index !== -1) {
					favourites.splice(index, 1);
				}
				favourites$_.next(favourites);
				LocalStorageService.set('favourites', favourites);
				//}
				return response.data;
			}),
		);
	}

}

FavouriteService.subscriptions$ = FavouriteService.subscriptions$().pipe(shareReplay(1));
FavouriteService.likes$ = FavouriteService.likes$().pipe(shareReplay(1));
FavouriteService.favourites$ = FavouriteService.favourites$().pipe(shareReplay(1));
