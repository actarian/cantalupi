import { Component } from 'rxcomp';
import { first } from 'rxjs/operators';
import ChannelService from './channel.service';

export default class ChannelComponent extends Component {

	toggleSubscribe() {
		let flag = this.channel.info.subscribed;
		ChannelService[flag ? 'unsubscribe$' : 'subscribe$'](this.channel.id).pipe(
			first()
		).subscribe(() => {
			flag = !flag;
			this.channel.info.subscribed = flag;
			if (flag) {
				this.channel.info.subscribers++;
			} else {
				this.channel.info.subscribers--;
			}
			this.pushChanges();
		});
	}

	toggleLike() {
		let flag = this.channel.info.liked;
		ChannelService[flag ? 'unlike$' : 'like$'](this.channel.id).pipe(
			first()
		).subscribe(() => {
			flag = !flag;
			this.channel.info.liked = flag;
			if (flag) {
				this.channel.info.likes++;
			} else {
				this.channel.info.likes--;
			}
			this.pushChanges();
		});
	}

}

ChannelComponent.meta = {
	selector: '[channel]',
	inputs: ['channel']
};
