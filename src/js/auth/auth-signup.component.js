import { Component } from 'rxcomp';
import { FormControl, FormGroup, Validators } from 'rxcomp-form';
import { takeUntil } from 'rxjs/operators';
import UserService from '../user/user.service';

export default class AuthSignupComponent extends Component {

	onInit() {
		const data = window.data || {
		    roles: [],
            countries: []
		};

		const form = new FormGroup({
			firstName: new FormControl(null, Validators.RequiredValidator()),
			lastName: new FormControl(null, Validators.RequiredValidator()),
			email: new FormControl(null, [Validators.RequiredValidator(), Validators.EmailValidator()]),
			company: new FormControl(null),
			role: new FormControl(null, Validators.RequiredValidator()),
			country: new FormControl(null, Validators.RequiredValidator()),
			newsletter: new FormControl(null),
			privacy: new FormControl(null, Validators.RequiredValidator()),
			checkRequest: window.antiforgery,
			checkField: '',
            action: window.formaction
		});

		const controls = form.controls;
		controls.role.options = data.roles;
		controls.country.options = data.countries;
		this.controls = controls;

		form.changes$.pipe(
			takeUntil(this.unsubscribe$)
		).subscribe((changes) => {
			// console.log('WorkWithUsComponent.form.changes$', changes, form.valid);
			this.pushChanges();
		});

		this.data = data;
		this.form = form;
		this.error = null;
		this.success = false;
	}

	test() {
		const role = this.controls.role.options.length ? this.controls.role.options[0].id : null;
		this.form.patch({
			firstName: 'Jhon',
			lastName: 'Appleseed',
			email: 'jhonappleseed@gmail.com',
			company: 'Websolute',
			country: 'Italy',
			role: role,
			privacy: true,
			checkRequest: window.antiforgery,
			checkField: ''
		});
	}

	reset() {
		this.form.reset();
	}

	onSubmit() {
		// console.log('AuthSignupComponent.onSubmit', 'form.valid', valid);
		if (this.form.valid) {
			// console.log('AuthSignupComponent.onSubmit', this.form.value);
			this.form.submitted = true;
			// HttpService.post$('/api/users/Register', this.form.value)
			UserService.register$(this.form.value)
				.subscribe(response => {
					console.log('AuthSignupComponent.onSubmit', response);
					this.success = true;
					dataLayer.push({
						'event': 'formSubmission',
						'form type': 'Registrazione'
					});
					this.form.reset();
					// this.pushChanges();
					// this.signUp.next(response);
				}, error => {
					console.log('AuthSignupComponent.error', error);
					this.error = error;
					this.form.submitted = false;
					this.pushChanges();
				});
		} else {
			this.form.touched = true;
		}
	}

	onLogin() {
		this.login.next();
	}

}

AuthSignupComponent.meta = {
	selector: '[auth-signup]',
	//outputs: ['signUp', 'login'],
};
