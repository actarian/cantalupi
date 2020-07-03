import { combineLatest } from 'rxjs';
import { first } from 'rxjs/operators';
import ChannelService from '../channel/channel.service';
import PageComponent from '../page/page.component';
import FavouriteService from './favourite.service';

export const ViewModes = {
	Saved: 'saved',
	Liked: 'liked',
};

export default class FavouritePageComponent extends PageComponent {

	get viewMode() {
		return this.viewMode_;
	}

	set viewMode(viewMode) {
		if (this.viewMode_ !== viewMode) {
			this.viewMode_ = viewMode;
			this.pushChanges();
		}
	}

	onInit() {
		this.channels = null;
		this.savedItems = [];
		this.likedItems = [];
		this.viewMode_ = ViewModes.Saved;
		this.grid = {
			mode: 1,
			width: 350,
			gutter: 2,
		};
		this.load$().pipe(
			first(),
		).subscribe(data => {
			this.channels = data[0];
			this.savedItems = data[1];
			this.likedItems = data[2];
			this.pushChanges();
		});
	}

	load$() {
		return combineLatest(
			ChannelService.channels$,
			FavouriteService.favourites$,
			FavouriteService.likes$,
		);
	}

	toggleGrid() {
		this.grid.width = this.grid.width === 350 ? 525 : 350;
		this.pushChanges();
	}

}

FavouritePageComponent.meta = {
	selector: '[favourite-page]',
};
