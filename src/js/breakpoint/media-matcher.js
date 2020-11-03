const EDGE = /(edge)/i.test(navigator.userAgent);
const TRIDENT = /(msie|trident)/i.test(navigator.userAgent);
const BLINK = (!!((window).chrome) && typeof CSS !== 'undefined' && !EDGE && !TRIDENT);
const WEBKIT = /AppleWebKit/i.test(navigator.userAgent) && !BLINK && !EDGE && !TRIDENT;
const IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);
const FIREFOX = /(firefox|minefield)/i.test(navigator.userAgent);
const ANDROID = /android/i.test(navigator.userAgent) && !TRIDENT;
const SAFARI = /safari/i.test(navigator.userAgent) && WEBKIT;

const mediaQueriesForWebkitCompatibility = new Set();

let mediaQueryStyleNode;

export class MediaMatcher {

	static matchMedia(query) {
		if (WEBKIT) {
			this.createEmptyStyleRule(query);
		}
		return this._matchMedia(query);
	}

	static createEmptyStyleRule(query) {
		if (mediaQueriesForWebkitCompatibility.has(query)) {
			return;
		}
		try {
			if (!mediaQueryStyleNode) {
				mediaQueryStyleNode = document.createElement('style');
				mediaQueryStyleNode.setAttribute('type', 'text/css');
				if (document.head) {
					document.head.appendChild(mediaQueryStyleNode);
				}
			}
			if (mediaQueryStyleNode.sheet) {
				(mediaQueryStyleNode.sheet)
				.insertRule(`@media ${query} {.fx-query-test{ }}`, 0);
				mediaQueriesForWebkitCompatibility.add(query);
			}
		} catch (e) {
			console.error(e);
		}
	}
}

function noopMatchMedia(query) {
	return {
		matches: query === 'all' || query === '',
		media: query,
		addListener: () => {},
		removeListener: () => {}
	};
}

MediaMatcher._matchMedia = window.matchMedia ? window.matchMedia.bind(window) : noopMatchMedia;
