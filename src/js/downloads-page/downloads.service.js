import { map } from 'rxjs/operators';
import ApiService from '../api/api.service';
import { STATIC } from '../environment';

export default class DownloadsService {

	static all$() {
		if (STATIC) {
			return ApiService.get$('/downloads/all').pipe(map(response => response.data));
		} else {
			return ApiService.get$('/downloads/all').pipe(map(response => response.data));
			return ApiService.get$(`/posts?lang=${ApiService.currentLanguage}`).pipe(map(response => response.data));
		}
	}

	static filters$() {
		if (STATIC) {
			return ApiService.get$('/downloads/filters').pipe(map(response => response.data));
		} else {
			return ApiService.get$('/downloads/filters').pipe(map(response => response.data));
			return ApiService.get$(`/categories?lang=${ApiService.currentLanguage}`).pipe(map(response => response.data));
		}
	}

}
