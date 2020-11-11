import { FormControl, FormGroup, Validators } from 'rxcomp-form';
import { combineLatest } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { FilterMode } from '../filter/filter-item';
import FilterService from '../filter/filter.service';
import HttpService from '../http/http.service';
import PageComponent from '../page/page.component';
import DownloadsService from './downloads.service';

export default class DownloadsPageComponent extends PageComponent {

	onInit() {
		this.items = [];
		this.filters = {};
		this.filter = {};
		this.load$().pipe(
			first(),
		).subscribe(data => {
			this.items = data[0];
			this.filters = data[1];
			this.onLoad();
			this.pushChanges();
		});
		this.makeForm();
	}

	load$() {
		return combineLatest([
			DownloadsService.all$(),
			DownloadsService.filters$(),
		]);
	}

	onLoad() {
		const items = this.items;
		const filters = this.filters;
		Object.keys(filters).forEach(key => {
			filters[key].mode = FilterMode.OR;
		});
		const initialParams = {};
		const filterService = new FilterService(filters, initialParams, (key, filter) => {
			switch (key) {
				default:
					filter.filter = (item, value) => {
						switch (key) {
							case 'category':
								return item.category.id === value;
								break;
							default:
							// return item.features.indexOf(value) !== -1;
						}
					};
			}
		});
		this.filterService = filterService;
		this.filters = filterService.filters;
		this.filter = this.filters.category;
		filterService.items$(items).pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(items => {
			this.items = items;
			this.pushChanges();
			// console.log('DownloadsPageComponent.items', items.length);
		});
	}

	toggleFilter(filter) {
		Object.keys(this.filters).forEach(key => {
			const f = this.filters[key];
			if (f === filter) {
				f.active = !f.active;
			} else {
				f.active = false;
			}
		});
		this.pushChanges();
	}

	clearFilter(event, filter) {
		event.preventDefault();
		event.stopImmediatePropagation();
		filter.clear();
		this.pushChanges();
	}


	makeForm() {
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
			message: new FormControl(null),
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
			message: 'Hi!',
			privacy: true,
			checkRequest: window.antiforgery,
			checkField: ''
		});
	}

	reset() {
		this.form.reset();
	}

	onSubmit() {
		// console.log('ContactsComponent.onSubmit', 'form.valid', valid);
		if (this.form.valid) {
			// console.log('ContactsComponent.onSubmit', this.form.value);
			this.form.submitted = true;
			HttpService.post$(globalVars.ajaxurl, this.form.value)
				.subscribe(response => {
					this.success = true;
					this.form.reset();
					// this.pushChanges();
					/*
					dataLayer.push({
						'event': 'formSubmission',
						'form type': 'Contatti'
					});
					*/
				}, error => {
					console.log('ContactsComponent.error', error);
					this.error = error;
					this.pushChanges();
				});
		} else {
			this.form.touched = true;
		}
	}



}

DownloadsPageComponent.meta = {
	selector: '[downloads-page]',
};
