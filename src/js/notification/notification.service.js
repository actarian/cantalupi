import { BehaviorSubject } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import ApiService from '../api/api.service';
import EventService from '../event/event.service';

const notifications$_ = new BehaviorSubject(null);
export default class NotificationService {

	static getCurrentNotifications() {
		return notifications$_.getValue();
	}

	static notifications$() {
		return ApiService.staticGet$(`/user/notification`).pipe(
			map((response) => EventService.mapEvents(response.data, response.static)),
			switchMap(items => {
				notifications$_.next(items);
				return notifications$_;
			})
		);
	}

}

NotificationService.notifications$ = NotificationService.notifications$().pipe(shareReplay(1));
