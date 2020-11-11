import { getContext } from 'rxcomp';
import ModalOutletComponent from '../modal/modal-outlet.component';
import ModalService from '../modal/modal.service';
import AuthComponent from './auth.component';

export default class AuthModalComponent extends AuthComponent {

	onInit() {
		super.onInit();
		const { parentInstance } = getContext(this);
		if (parentInstance instanceof ModalOutletComponent) {
			const data = parentInstance.modal.data;
			this.view = data.view;
			// console.log('AuthModalComponent.onInit', data);
		}
	}

	onSignIn(user) {
		// console.log('AuthModalComponent.onSignIn', user);
		ModalService.resolve(user);
	}

	onSignUp(user) {
		// console.log('AuthModalComponent.onSignUp', user);
		ModalService.resolve(user);
	}

	/*
	onDestroy() {
		// console.log('AuthModalComponent.onDestroy');
	}
	*/

	close() {
		ModalService.reject();
	}

}

AuthModalComponent.meta = {
	selector: '[auth-modal]'
};
