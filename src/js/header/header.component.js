import { Component } from 'rxcomp';
import { takeUntil } from 'rxjs/operators';
import CssService from '../css/css.service';
// import UserService from '../user/user.service';

export default class HeaderComponent extends Component {

	onInit() {
		this.user = null;
		/*
		UserService.me$().pipe(
			catchError(() => of (null)),
			takeUntil(this.unsubscribe$)
		).subscribe(user => {
			console.log('HeaderComponent.me$', user);
			this.user = user;
			this.pushChanges();
		});
		*/
		CssService.height$().pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(height => {
			console.log('HeaderComponent.height$', height);
		});
	}

	/*
	toggleAside($event) {
		this.aside_ = !this.aside_;
		this.aside.next(this.aside_);
	}

	dismissAside($event) {
		if (this.aside_) {
			this.aside_ = false;
			this.aside.next(this.aside_);
		}
	}
	*/

}

HeaderComponent.meta = {
	selector: 'header',
	outputs: ['aside']
};
