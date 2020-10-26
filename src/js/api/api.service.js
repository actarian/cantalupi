import { getApiUrl } from '../environment';
import HttpService from '../http/http.service';
import CookieStorageService from '../storage/cookie-storage.service';

export default class ApiService extends HttpService {

	static currentLanguage = CookieStorageService.getRaw('wp-wpml_current_language'); // || 'it';

	static get$(url, data, format) {
		return super.get$(getApiUrl(url), data, format);
	}

	static delete$(url) {
		return super.delete$(getApiUrl(url));
	}

	static post$(url, data) {
		return super.post$(getApiUrl(url), data);
	}

	static put$(url, data) {
		return super.put$(getApiUrl(url), data);
	}

	static patch$(url, data) {
		return super.patch$(getApiUrl(url), data);
	}

	static staticGet$(url, data, format) {
		return super.get$(getApiUrl(url, true), data, format);
	}

	static staticDelete$(url) {
		return super.delete$(getApiUrl(url, true));
	}

	static staticPost$(url, data) {
		return super.post$(getApiUrl(url, true), data);
	}

	static staticPut$(url, data) {
		return super.put$(getApiUrl(url, true), data);
	}

	static staticPatch$(url, data) {
		return super.patch$(getApiUrl(url, true), data);
	}

}
