import { Component } from 'rxcomp';
import { first } from 'rxjs/operators';
import FavouriteService from '../favourite/favourite.service';

export default class EventComponent extends Component {

	onChange($event) {
		this.pushChanges();
	}

	toggleSubscribe() {
		let flag = this.event.info.subscribed;
		FavouriteService[flag ? 'subscriptionRemove$' : 'subscriptionAdd$'](this.event.id).pipe(
			first()
		).subscribe(() => {
			flag = !flag;
			this.event.info.subscribed = flag;
			if (flag) {
				this.event.info.subscribers++;
			} else {
				this.event.info.subscribers--;
			}
			this.pushChanges();
		});
	}

	toggleLike() {
		let flag = this.event.info.liked;
		FavouriteService[flag ? 'likeRemove$' : 'likeAdd$'](this.event.id).pipe(
			first()
		).subscribe(() => {
			flag = !flag;
			this.event.info.liked = flag;
			if (flag) {
				this.event.info.likes++;
			} else {
				this.event.info.likes--;
			}
			this.pushChanges();
		});
	}

	toggleSave() {
		let flag = this.event.info.saved;
		FavouriteService[flag ? 'favouriteRemove$' : 'favouriteAdd$'](this.event.id).pipe(
			first()
		).subscribe(() => {
			flag = !flag;
			this.event.info.saved = flag;
			this.pushChanges();
		});
	}

}

EventComponent.meta = {
	selector: '[event]',
	inputs: ['event']
};
