import { combineLatest } from 'rxjs';
import { first } from 'rxjs/operators';
import ChannelService from '../channel/channel.service';
import LocationService from '../location/location.service';
import PageComponent from '../page/page.component';

export default class AsideComponent extends PageComponent {

	onInit() {
		let channelId = LocationService.get('channelId');
		channelId = channelId ? parseInt(channelId) : null;
		this.channelId = channelId;
		this.channels = [];
		this.load$().pipe(
			first(),
		).subscribe(data => {
			this.channels = data[0];
			this.pushChanges();
		});
	}

	load$() {
		return combineLatest(
			ChannelService.channels$,
		);
	}

}

AsideComponent.meta = {
	selector: '[aside]',
};
