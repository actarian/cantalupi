import { Component, getContext } from 'rxcomp';
import { interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export default class FadingGalleryComponent extends Component {

	onInit() {
		const { node } = getContext(this);
		const images = this.images = Array.prototype.slice.call(node.querySelectorAll('img'));
		this.index = 0;
		interval(2500).pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(() => {
			this.onNext();
		});
	}

	onNext() {
		this.index = (this.index + 1) % this.images.length;
		this.pushChanges();
	}

}

FadingGalleryComponent.meta = {
	selector: '[fading-gallery]'
};
