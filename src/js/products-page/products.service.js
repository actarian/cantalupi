import { map } from 'rxjs/operators';
import ApiService from '../api/api.service';
import { STATIC } from '../environment';

/*
tutte le news: http://dev-cantalupilighting.wslabs.it/wp-json/cantalupi/v1/posts?lang=it
news categorizzate (es. progetti): http://dev-cantalupilighting.wslabs.it/wp-json/cantalupi/v1/posts/projects?lang=it
(dunque http://dev-cantalupilighting.wslabs.it/wp-json/cantalupi/v1/posts/<slug-categoria>?lang=it)
categorie news: http://dev-cantalupilighting.wslabs.it/wp-json/cantalupi/v1/categories?lang=it
tutti i prodotti: http://dev-cantalupilighting.wslabs.it/wp-json/cantalupi/v1/collections?lang=it
prodotti della collezione: http://dev-cantalupilighting.wslabs.it/wp-json/cantalupi/v1/collections/villa-lighting-collection-for-interiors?lang=it (dunque http://dev-cantalupilighting.wslabs.it/wp-json/cantalupi/v1/collections/<slug-collezione>?lang=it)
filtri tutti prodotti: http://dev-cantalupilighting.wslabs.it/wp-json/cantalupi/v1/filters?lang=it
filtri della collezione: http://dev-cantalupilighting.wslabs.it/wp-json/cantalupi/v1/filters/villa-lighting-collection-for-interiors?lang=it (dunque http://dev-cantalupilighting.wslabs.it/wp-json/cantalupi/v1/filters/<slug-collezione>?lang=it)

lo slug lo ricavi dalla url,
la lingua dai cookie
<https://teams.microsoft.com/l/message/19:5112c9ae31584221b88ee971941c1fbe@thread.tacv2/1601021903690?tenantId=bde1b277-aa36-41f6-a602-48f09fbc6709&amp;groupId=02b877a0-0b1d-470a-a415-0bc6075ad4a3&amp;parentMessageId=1600185616610&amp;teamName=Cantalupi&amp;channelName=Sito&amp;createdTime=1601021903690>
*/

export default class ProductsService {

	static all$() {
		if (STATIC) {
			return ApiService.get$('/products/yachts-exteriors').pipe(map(response => response.data));
		} else {
			'pathname: "/it/linee/yacht-lighting-collection-for-interiors/"'
			const segments = location.pathname.split('/');
			const slug = segments[segments.length - 2];
			return ApiService.get$(`/collections/${slug}?lang=${ApiService.currentLanguage}`).pipe(map(response => response.data));
		}
	}

	static filters$() {
		if (STATIC) {
			return ApiService.get$('/products/filters').pipe(map(response => response.data));
		} else {
			return ApiService.get$(`/filters?lang=${ApiService.currentLanguage}`).pipe(map(response => response.data));
		}
	}

}
