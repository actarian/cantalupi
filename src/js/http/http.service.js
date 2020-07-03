import { from, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export class HttpResponse {

	get static() {
		return this.url.indexOf('.json') === this.url.length - 5;
	}

	constructor(response) {
		this.data = null;
		if (response) {
			this.url = response.url;
			this.status = response.status;
			this.statusText = response.statusText;
			this.ok = response.ok;
			this.redirected = response.redirected;
		}
	}
}

export default class HttpService {

	static http$(method, url, data, format = 'json') {
		method = url.indexOf('.json') !== -1 ? 'GET' : method;
		const methods = ['POST', 'PUT', 'PATCH'];
		let response_ = null;
		return from(fetch(url, {
			method: method,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: methods.indexOf(method) !== -1 ? JSON.stringify(data) : undefined
		}).then((response) => {
			response_ = new HttpResponse(response);
			return response[format]().then(json => {
				response_.data = json;
				if (response.ok) {
					return Promise.resolve(response_);
				} else {
					return Promise.reject(response_);
				}
			});
			/*
			if (response.ok) {
				return response[format]();
			} else {
				return response.json().then(json => {
					return Promise.reject(json);
				});
			}
			*/
		})).pipe(
			catchError(error => {
				return throwError(this.getError(error, response_));
			})
		);
	}

	static get$(url, data, format) {
		const query = this.query(data);
		return this.http$('GET', `${url}${query}`, undefined, format);
	}

	static delete$(url) {
		return this.http$('DELETE', url);
	}

	static post$(url, data) {
		return this.http$('POST', url, data);
	}

	static put$(url, data) {
		return this.http$('PUT', url, data);
	}

	static patch$(url, data) {
		return this.http$('PATCH', url, data);
	}

	static query(data) {
		return ''; // todo
	}

	static getError(object, response) {
		let error = typeof object === 'object' ? object : {};
		if (!error.statusCode) {
			error.statusCode = response ? response.status : 0;
		}
		if (!error.statusMessage) {
			error.statusMessage = response ? response.statusText : object;
		}
		console.log('HttpService.getError', error, object);
		return error;
	}

}
