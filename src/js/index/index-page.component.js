import { combineLatest, of } from 'rxjs';
import PageComponent from '../page/page.component';

export default class IndexPageComponent extends PageComponent {

	onInit() {
		/*
		this.data01 = this.data02 = null;
		this.load$().pipe(
			first(),
		).subscribe(data => {
			this.data01 = data[0];
			this.data02 = data[1];
			this.pushChanges();
		});
		*/
	}

	load$() {
		return combineLatest( of (1), of (2), );
	}

}

IndexPageComponent.meta = {
	selector: '[index-page]',
};
