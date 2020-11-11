import { Component } from 'rxcomp';
import { FormControl, FormGroup, Validators } from 'rxcomp-form';
import { takeUntil } from 'rxjs/operators';
import UserService from '../user/user.service';

export default class AuthSigninComponent extends Component {

	onInit() {
		const data = window.data || {
			interests: []
		};

		const form = new FormGroup({
			email: new FormControl(null, [Validators.RequiredValidator(), Validators.EmailValidator()]),
			password: new FormControl(null, Validators.RequiredValidator()),
			checkRequest: window.antiforgery,
			checkField: ''
		});

		const controls = form.controls;
		this.controls = controls;

		form.changes$.pipe(
			takeUntil(this.unsubscribe$)
		).subscribe((changes) => {
			// console.log('AuthSigninComponent.form.changes$', changes, form.valid);
			this.pushChanges();
		});

		this.form = form;
		this.error = null;
		this.success = false;
	}

	test() {
		this.form.patch({
			email: 'jhonappleseed@gmail.com',
			password: 'password',
			checkRequest: window.antiforgery,
			checkField: ''
		});
	}

	reset() {
		this.form.reset();
	}

	onSubmit() {
		// console.log('AuthSigninComponent.onSubmit', 'form.valid', valid);
		if (this.form.valid) {
			// console.log('AuthSigninComponent.onSubmit', this.form.value);
			this.form.submitted = true;
			// HttpService.post$('/api/users/Login', this.form.value)
			UserService.login$(this.form.value)
				.subscribe(response => {
					console.log('AuthSigninComponent.onSubmit', response);
					this.success = true;
					// this.form.reset();
					this.pushChanges();
					this.signIn.next(typeof response === 'string' ? { status: response } : response);
				}, error => {
					console.log('AuthSigninComponent.error', error);
					this.error = error;
					this.pushChanges();
				});
		} else {
			this.form.touched = true;
		}
	}

	onForgot() {
		this.forgot.next();
	}

	onRegister() {
		this.register.next();
	}

}

AuthSigninComponent.meta = {
	selector: '[auth-signin]',
	outputs: ['signIn', 'forgot', 'register'],
};
