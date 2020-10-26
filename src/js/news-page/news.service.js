import { map } from 'rxjs/operators';
import ApiService from '../api/api.service';
import { STATIC } from '../environment';

export default class NewsService {

	static all$() {
		if (STATIC) {
			return ApiService.get$('/news/all').pipe(map(response => response.data));
		} else {
			return ApiService.get$(`/posts?lang=${ApiService.currentLanguage}`).pipe(map(response => response.data));
		}
	}

	static filters$() {
		if (STATIC) {
			return ApiService.get$('/news/filters').pipe(map(response => response.data));
		} else {
			return ApiService.get$(`/categories?lang=${ApiService.currentLanguage}`).pipe(map(response => response.data));
		}
	}

}
