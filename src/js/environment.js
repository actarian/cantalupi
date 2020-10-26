export const NODE = (typeof module !== 'undefined' && module.exports);
export const PARAMS = NODE ? { get: () => { } } : new URLSearchParams(window.location.search);
export const DEBUG = false || (PARAMS.get('debug') != null);
export const BASE_HREF = NODE ? null : document.querySelector('base').getAttribute('href');
export const STATIC = NODE ? false : (window && (window.location.port === '40525' || window.location.host === 'actarian.github.io' || window.location.host === 'cantalupi.herokuapp.com'));
export const DEVELOPMENT = NODE ? false : (window && ['localhost', '127.0.0.1', '0.0.0.0'].indexOf(window.location.host.split(':')[0]) !== -1);
export const PRODUCTION = !DEVELOPMENT;
export const ENV = {
	NAME: 'cantalupi',
	STATIC,
	DEVELOPMENT,
	PRODUCTION,
	RESOURCE: '/docs/',
	STATIC_RESOURCE: './',
	API: '/wp-json/cantalupi/v1',
	STATIC_API: (DEVELOPMENT && !STATIC) ? '/Client/docs/api' : './api',
};

export function getApiUrl(url, useStatic) {
	const base = (useStatic || STATIC) ? ENV.STATIC_API : ENV.API;
	const json = (useStatic || STATIC) ? '.json' : '';
	return `${base}${url}${json}`;
}
export function getResourceRoot() {
	return STATIC ? ENV.STATIC_RESOURCE : ENV.RESOURCE;
}
export function getSlug(url) {
	if (!url) {
		return url;
	}
	if (url.indexOf(`/${ENV.NAME}`) !== 0) {
		return url;
	}
	if (STATIC) {
		console.log(url);
		return url;
	}
	url = url.replace(`/${ENV.NAME}`, '');
	url = url.replace('.html', '');
	return `/it/it${url}`;
}

export class Environment {

	get href() {
		if (window.location.host.indexOf('herokuapp') !== -1) {
			return 'https://raw.githubusercontent.com/actarian/cantalupi/master/docs/';
		} else {
			return BASE_HREF;
		}
	}

	get host() {
		let host = window.location.host.replace('127.0.0.1', '192.168.1.2');
		if (host.substr(host.length - 1, 1) === '/') {
			host = host.substr(0, host.length - 1);
		}
		return `${window.location.protocol}//${host}${BASE_HREF}`;
	}

	constructor(options) {
		if (options) {
			Object.assign(this, options);
		}
	}

}

export const environment = new Environment({
	port: 5000,
});
