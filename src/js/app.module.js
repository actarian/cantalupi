import { CoreModule, Module } from 'rxcomp';
import { FormModule } from 'rxcomp-form';
import AppComponent from './app.component';
import ClickOutsideDirective from './click-outside/click-outside.directive';
import CoverComponent from './cover/cover.component';
import DatePipe from './date/date.pipe';
import DropdownItemDirective from './dropdown/dropdown-item.directive';
import DropdownDirective from './dropdown/dropdown.directive';
import ErrorsComponent from './forms/errors.component';
import GalleryComponent from './gallery/gallery.component';
import HeaderComponent from './header/header.component';
import HtmlPipe from './html/html.pipe';
import { default as EmotionalPageComponent, default as IndexPageComponent } from './index/index-page.component';
import LazyPictureDirective from './lazy/lazy-picture.directive';
import LazyDirective from './lazy/lazy.directive';
import LocomotiveDirective from './locomotive/locomotive.directive';
import ModalOutletComponent from './modal/modal-outlet.component';
import ModalComponent from './modal/modal.component';
import OverlayEffectDirective from './overlay-effect/overlay-effect.directive';
import OverlayWebglDirective from './overlay-effect/overlay-webgl.directive';
import ProductsPageComponent from './products-page/products-page.component';
import ScrollToDirective from './scroll-to/scroll-to.directive';
import SecureDirective from './secure/secure.directive';
import SlugPipe from './slug/slug.pipe';
import VirtualStructure from './virtual/virtual.structure';

export default class AppModule extends Module {}

AppModule.meta = {
	imports: [
		CoreModule,
		FormModule,
	],
	declarations: [
		ClickOutsideDirective,
		CoverComponent,
		DatePipe,
		DropdownDirective,
		DropdownItemDirective,
		EmotionalPageComponent,
		ErrorsComponent,
		GalleryComponent,
		HeaderComponent,
		HtmlPipe,
		IndexPageComponent,
		LazyDirective,
		LazyPictureDirective,
		LocomotiveDirective,
		ModalComponent,
		ModalOutletComponent,
		OverlayEffectDirective,
		OverlayWebglDirective,
		ProductsPageComponent,
		ScrollToDirective,
		SecureDirective,
		SlugPipe,
		VirtualStructure
	],
	bootstrap: AppComponent,
};
