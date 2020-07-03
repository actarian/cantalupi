import { takeUntil } from 'rxjs/operators';
import PageComponent from '../page/page.component';
import NotificationService from './notification.service';

export default class NotificationComponent extends PageComponent {

	onInit() {
		this.grid = {
			mode: 4,
			width: 320,
			gutter: 0,
		};
		this.notifications = [];
		NotificationService.notifications$.pipe(
			takeUntil(this.unsubscribe$)
		).subscribe((notifications) => {
			this.notifications = notifications;
			this.pushChanges();
		});
	}

}

NotificationComponent.meta = {
	selector: '[notification]',
};
