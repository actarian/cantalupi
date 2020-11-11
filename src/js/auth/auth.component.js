import { Component, getContext } from 'rxcomp';
import UserService from '../user/user.service';

export default class AuthComponent extends Component {

	onInit() {
		const { node } = getContext(this);
		this.views = {
			SIGN_IN: 1,
			SIGN_UP: 2,
			FORGOTTEN: 3,
		};
		this.view = node.hasAttribute('view') ? parseInt(node.getAttribute('view')) : this.views.SIGN_IN;
	}

	onForgot(event) {
		// console.log('AuthComponent.onForgot');
		this.view = this.views.FORGOTTEN;
		this.pushChanges();
	}

	onLogin(event) {
		// console.log('AuthComponent.onLogin');
		this.view = this.views.SIGN_IN;
		this.pushChanges();
	}

	onRegister(event) {
		// console.log('AuthComponent.onRegister');
		this.view = this.views.SIGN_UP;
		this.pushChanges();
	}

	onSignIn(user) {
		console.log('AuthComponent.onSignIn', user);
		UserService.setUser(user);
		window.location.href = this.auth;
		// nav to profile
	}

	onSignUp(user) {
		console.log('AuthComponent.onSignUp', user);
		UserService.setUser(user);
		window.location.href = this.auth;
		// nav to profile
	}

	onForgottenSent(email) {
		/*
		console.log('AuthComponent.onForgottenSent', email);
		this.view = this.views.SIGN_IN;
		this.pushChanges();
		*/
	}
}

AuthComponent.meta = {
	selector: '[auth]',
	inputs: ['auth']
};
