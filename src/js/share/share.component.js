import { Component } from 'rxcomp';

export default class ShareComponent extends Component {

	get facebookUrl() {
		return `https://www.facebook.com/sharer/sharer.php?u=${this.getUrl()}`;
	}

	get pinterestUrl() {
		return `https://www.pinterest.com/pin/create/button/?url=${this.getUrl()}&media=&description=${this.getTitle()}`;
	}

	get linkedInUrl() {
		return `https://www.linkedin.com/shareArticle?mini=true&url=${this.getUrl()}&title=${this.getTitle()}`;
	}

	get twitterUrl() {
		return `https://twitter.com/intent/tweet?text=${this.getTitle()}%20${this.getUrl()}`;
	}

	get whatsappUrl() {
		return `https://api.whatsapp.com/send?text=${this.getUrl()}`;
	}

	get mailToUrl() {
		return `mailto:?subject=${this.getTitle()}&body=${this.getUrl()}`;
	}

	onInit() {
		console.log('ShareComponent.onInit', this.share, this.title);
	}

	onChanges() {
		console.log('ShareComponent.onChanges', this.share, this.title);
	}

	getTitle() {
		let title = this.title ? this.title : document.title;
		return this.encodeURI(title);
	}

	getUrl() {
		let url = this.share;
		if (url) {
			if (url.indexOf(window.location.origin) === -1) {
				url = window.location.origin + (url.indexOf('/') === 0 ? url : ('/' + url));
			}
		} else {
			url = window.location.href;
		}
		return this.encodeURI(url);
	}

	encodeURI(text) {
		return encodeURIComponent(text).replace(/[!'()*]/g, function(c) {
			return '%' + c.charCodeAt(0).toString(16);
		});
	}

}

ShareComponent.meta = {
	selector: '[share]',
	inputs: ['share', 'title'],
	template: /* html */`
	<ul class="nav--share">
		<li>
			<a [href]="facebookUrl" target="_blank"><svg class="facebook"><use xlink:href="#facebook"></use></svg></a>
		</li>
		<li>
			<a [href]="twitterUrl" target="_blank"><svg class="twitter"><use xlink:href="#twitter"></use></svg></a>
		</li>
		<li>
			<a [href]="pinterestUrl" target="_blank"><svg class="pinterest"><use xlink:href="#pinterest"></use></svg></a>
		</li>
		<li>
			<a [href]="linkedInUrl" target="_blank"><svg class="linkedin"><use xlink:href="#linkedin"></use></svg></a>
		</li>
		<!--
		<li>
			<a [href]="whatsappUrl" target="_blank"><svg class="whatsapp"><use xlink:href="#whatsapp"></use></svg></a>
		</li>
		<li>
			<a [href]="mailToUrl"><svg class="email"><use xlink:href="#email"></use></svg></a>
		</li>
		-->
	</ul>
	`,
};
