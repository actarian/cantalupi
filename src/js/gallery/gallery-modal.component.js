import { Component, getContext } from 'rxcomp';
import ModalOutletComponent from '../modal/modal-outlet.component';
import ModalService from '../modal/modal.service';

export default class GalleryModalComponent extends Component {

	onInit() {
		super.onInit();
		const { parentInstance, node } = getContext(this);
		if (parentInstance instanceof ModalOutletComponent) {
			const data = this.data = parentInstance.modal.data;
			this.sliderItems = data.items;
			this.sliderIndex = data.index;
		}
	}

	close() {
		ModalService.reject();
	}

	onChange(event) {
		// console.log('onChange', event);
	}

	onTween(event) {
		// console.log('onTween', event);
	}

}

GalleryModalComponent.meta = {
	selector: '[gallery-modal]'
};
