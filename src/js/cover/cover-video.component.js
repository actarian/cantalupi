import { Component, getContext } from 'rxcomp';
import Splitting from 'splitting';

export default class CoverVideoComponent extends Component {

	onInit() {
		const { node } = getContext(this);
		const brand = node.querySelector('.brand');
		gsap.to(brand, 0.4, {
			opacity: 1,
			onComplete: () => {
				const skip = node.querySelector('.btn--skip');
				gsap.to(skip, 0.4, {
					opacity: 1,
					delay: 2,
					onComplete: () => {
						let i = 0;
						const repeat = 2;
						const video = node.querySelector('video');
						const onEnded = () => {
							console.log('onEnded');
							i++;
							if (i < repeat) {
								video.play();
							} else {
								video.removeEventListener('ended', onEnded);
								setTimeout(() => {
									this.skip.next();
								}, 2000);
							}
						};
						video.addEventListener('ended', onEnded);
						video.play();
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

CoverVideoComponent.meta = {
	selector: '[cover-video]',
	outputs: ['skip']
};
