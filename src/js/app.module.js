import { CoreModule, Module } from 'rxcomp';
import { FormModule } from 'rxcomp-form';
import AppComponent from './app.component';
import CardSerieComponent from './card/card-serie';
import CardServiceComponent from './card/card-service';
import ClickOutsideDirective from './click-outside/click-outside.directive';
import ContactsComponent from './contacts/contacts.component';
import CoverVideoComponent from './cover/cover-video.component';
import CoverComponent from './cover/cover.component';
import DatePipe from './date/date.pipe';
import DropdownItemDirective from './dropdown/dropdown-item.directive';
import DropdownDirective from './dropdown/dropdown.directive';
import FadingGalleryComponent from './fading-gallery/fading-gallery.component';
import ControlCheckboxComponent from './forms/control-checkbox.component';
import ControlCustomSelectComponent from './forms/control-custom-select.component';
import ControlTextComponent from './forms/control-text.component';
import ControlTextareaComponent from './forms/control-textarea.component';
import ErrorsComponent from './forms/errors.component';
import TestComponent from './forms/test.component';
import GalleryModalComponent from './gallery/gallery-modal.component';
import GalleryComponent from './gallery/gallery.component';
import HeaderComponent from './header/header.component';
import HtmlPipe from './html/html.pipe';
import LazyPictureDirective from './lazy/lazy-picture.directive';
import LazyDirective from './lazy/lazy.directive';
import LocomotiveDirective from './locomotive/locomotive.directive';
import ModalOutletComponent from './modal/modal-outlet.component';
import ModalComponent from './modal/modal.component';
import NewsPageComponent from './news-page/news-page.component';
import OverlayEffectDirective from './overlay-effect/overlay-effect.directive';
import OverlayWebglDirective from './overlay-effect/overlay-webgl.directive';
import ProductsPageComponent from './products-page/products-page.component';
import ScrollToDirective from './scroll-to/scroll-to.directive';
import SecureDirective from './secure/secure.directive';
import ShareComponent from './share/share.component';
import SliderProductsRelatedComponent from './slider/slider-products-related.component';
import SliderServiceComponent from './slider/slider-service.component';
import SliderComponent from './slider/slider.component';
import SlugPipe from './slug/slug.pipe';
import VirtualStructure from './virtual/virtual.structure';

export default class AppModule extends Module { }

AppModule.meta = {
	imports: [
		CoreModule,
		FormModule,
	],
	declarations: [
		CardServiceComponent,
		CardSerieComponent,
		ClickOutsideDirective,
		ContactsComponent,
		ControlCheckboxComponent,
		ControlCustomSelectComponent,
		ControlTextComponent,
		ControlTextareaComponent,
		CoverComponent,
		CoverVideoComponent,
		DatePipe,
		DropdownDirective,
		DropdownItemDirective,
		ErrorsComponent,
		FadingGalleryComponent,
		GalleryComponent,
		GalleryModalComponent,
		HeaderComponent,
		HtmlPipe,
		LazyDirective,
		LazyPictureDirective,
		LocomotiveDirective,
		ModalComponent,
		ModalOutletComponent,
		NewsPageComponent,
		OverlayEffectDirective,
		OverlayWebglDirective,
		ProductsPageComponent,
		ScrollToDirective,
		SecureDirective,
		ShareComponent,
		SliderComponent,
		SliderProductsRelatedComponent,
		SliderServiceComponent,
		SlugPipe,
		TestComponent,
		VirtualStructure
	],
	bootstrap: AppComponent,
};
