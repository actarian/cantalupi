import { Component, getContext } from 'rxcomp';
import Splitting from 'splitting';

export default class CoverComponent extends Component {

	onInit() {
		const { node } = getContext(this);
		const brand = node.querySelector('.brand');
		gsap.to(brand, 0.4, {
			opacity: 1,
			onComplete: () => {
				const skip = node.querySelector('.btn--skip');
				gsap.to(skip, 0.4, {
					opacity: 1,
					delay: 3,
					onComplete: () => {
						const images = Array.prototype.slice.call(node.querySelectorAll('.background img'));
						gsap.to(images, {
							opacity: 1,
							delay: 2,
							duration: 0.6,
							stagger: {
								each: 3,
								ease: Power0.easeNone
							},
							onComplete: () => {
								console.log('complete!');
								setTimeout(() => {
									this.skip.next();
								}, 4400);
							}
						});
						gsap.to(images, {
							scale: 1.05,
							delay: 2,
							duration: 4,
							stagger: {
								each: 3,
								ease: Power0.easeNone
							}
						});
					}
				});
			}
		});
		const title = node.querySelector('.title');
		Splitting({ target: [title] });
	}

	onSkip(event) {
		this.skip.next();
	}

}

CoverComponent.meta = {
	selector: '[cover]',
	outputs: ['skip']
};
