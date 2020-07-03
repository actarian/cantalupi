import { Component } from 'rxcomp';
import { FormControl } from 'rxcomp-form';
import { takeUntil } from 'rxjs/operators';

export default class DownloadsComponent extends Component {

	onInit() {
		console.log(this.downloads);
		this.items = window[this.downloads];
		this.control = new FormControl(this.items[0].id);
		this.control.options = this.items;
		this.control.changes$.pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(changes => this.pushChanges());
	}

}

DownloadsComponent.meta = {
	selector: '[downloads]',
	inputs: ['downloads']
};
