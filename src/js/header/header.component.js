import { Component, getContext } from 'rxcomp';
import { takeUntil } from 'rxjs/operators';
import CssService from '../css/css.service';
// import UserService from '../user/user.service';

export default class HeaderComponent extends Component {

	onInit() {
		this.mainActive = false;
		CssService.height$().pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(height => {
			console.log('HeaderComponent.height$', height);
		});
	}

	onMainToggle() {
		this.mainActive = !this.mainActive;
		const { node } = getContext(this);
		const items = Array.prototype.slice.call(node.querySelectorAll('.nav--primary-menu > li'));
		gsap.to(items, {
			opacity: this.mainActive ? 1 : 0,
			duration: 0.35,
			stagger: {
				each: 0.05,
				ease: Power3.easeOut
			}
		});
		this.pushChanges();
		this.toggle.next(this.mainActive);
	}

	onOpenSub(subId) {
		this.subId = subId;
		this.pushChanges();
	}

	onCloseSub(subId) {
		if (this.subId === subId) {
			this.subId = null;
			this.pushChanges();
		}
	}

	isSubOpen(subId) {
		return this.subId === subId;
	}

	isPrimaryHidden() {
		return this.subId != null;
	}

}

HeaderComponent.meta = {
	selector: 'header',
	outputs: ['toggle']
};
