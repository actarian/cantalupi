import { Component, getContext } from 'rxcomp';

export default class ThronComponent extends Component {

	onInit() {
		const THRON = window.THRONContentExperience || window.THRONPlayer;
		if (!THRON) {
			return;
		}
		ThronComponent.registerSkin();
		const { node } = getContext(this);
		node.setAttribute('id', `thron-${this.rxcompId}`);

		let media = this.thron;
		if (media.indexOf('pkey=') === -1) {
			const splitted = media.split('/');
			const clientId = splitted[6];
			const xcontentId = splitted[7];
			const pkey = splitted[8];
			media = `https://gruppoconcorde-view.thron.com/api/xcontents/resources/delivery/getContentDetail?clientId=${clientId}&xcontentId=${xcontentId}&pkey=${pkey}`;
			// console.log(media);
		}
		const controls = node.hasAttribute('controls') ? true : false,
			loop = node.hasAttribute('loop') ? true : false,
			autoplay = node.hasAttribute('autoplay') ? true : false,
			live = node.hasAttribute('live') ? true : false;
		const player = this.player = THRON(node.id, {
			media: media,
			loop: loop,
			autoplay: autoplay,
			muted: !controls,
			displayLinked: 'close',
			noSkin: !controls,
			// lockBitrate: 'max',
			//loader spinner color
			preloadColor: '#446CB3',
			//Audio Wave color
			waveColor: '#ffffff',
			waveProgressColor: '#446CB3'
		});
		/*
		// Set the bottom bar of the video with share and fullscreen only. The first on the left and the second to the right.
		const params = {
			sessId: 'asessId',
			clientId: 'aclientId',
			xcontentId: 'acontentId'
		};
		*/
		this.onBeforeInit = this.onBeforeInit.bind(this);
		this.onReady = this.onReady.bind(this);
		this.onCanPlay = this.onCanPlay.bind(this);
		this.onPlaying = this.onPlaying.bind(this);
		this.onComplete = this.onComplete.bind(this);
		player.on('beforeInit', this.onBeforeInit);
		player.on('ready', this.onReady);
		player.on('canPlay', this.onCanPlay);
		player.on('playing', this.onPlaying);
		player.on('complete', this.onComplete);
	}

	onBeforeInit(playerInstance) {
		// VIDEO: ['captionText', 'shareButton', 'downloadableButton', 'playButton', 'timeSeek', 'timeInfoText', 'volumeButton', 'hdButton', 'speedButton', 'fullscreenButton', 'subtitleButton'],
		const removedElements = ['captionText', 'subtitleButton', 'downloadableButton', 'speedButton'];

		const { node } = getContext(this);
		const live = node.hasAttribute('live') ? true : false;
		if (live) {
			removedElements.push('timeSeek', 'timeInfoText');
		}
		// Removes playButton and hdButton from schema bar
		const schema = window.THRONSchemaHelper.getSchema();
		const elements = window.THRONSchemaHelper.removeElementsById(schema, 'VIDEO', removedElements);
		// A simple verify: existsElements must false
		const existsElements = window.THRONSchemaHelper.getElementsById(schema, 'VIDEO', removedElements).coordinates.length > 0;
		console.log('ThronComponent.onBeforeInit.existsElements', existsElements);
		const params = { bars: schema };
		playerInstance.params(params);
	}

	onReady() {
		const { node } = getContext(this);
		const controls = node.hasAttribute('controls') ? true : false;
		if (!controls) {
			const player = this.player;
			const mediaContainer = player.mediaContainer();
			const video = mediaContainer.querySelector('video');
			video.setAttribute('playsinline', 'true');
		}
		this.ready.next(this);
	}

	onCanPlay() {
		this.canPlay.next(this);
	}

	onPlaying() {
		const player = this.player;
		player.off('playing', this.onPlaying);
		const { node } = getContext(this);
		const controls = node.hasAttribute('controls') ? true : false;
		if (!controls) {
			const qualities = player.qualityLevels();
			if (qualities.length) {
				const highestQuality = qualities[qualities.length - 1].index;
				const lowestQuality = qualities[0].index;
				player.currentQuality(highestQuality);
			}
		}
	}

	onComplete() {
		this.complete.next(this);
	}

	onDestroy() {
		const player = this.player;
		player.off('ready', this.onReady);
		player.off('canPlay', this.onCanPlay);
		player.off('playing', this.onPlaying);
		player.off('complete', this.onComplete);
	}

	play() {
		const player = this.player;
		const status = player.status();
		if (status && !status.playing) {
			player.play();
		}
	}

	pause() {
		const player = this.player;
		const status = player.status();
		if (status && status.playing) {
			player.pause();
		}
	}

	static registerSkin() {
		if (window.wseThronPlugin) {
			return;
		}
		window.wseThronPlugin = function(playerInstance, dom, otherparams, jquery) {
			this.player = playerInstance;
			this.$ = jquery;
			/*
			this.player.on('beforeInit',
				function(playerInstance) {
					console.log('set action before player init', playerInstance, 'otherparams', otherparams);
					var params = {
						volume: 0.5,
						autoplay: false,
						linkedContent: 'show',
						//loader spinner color
						preloadColor: '#f39900',
						//Audio Wave color
						waveColor: '#ffffff',
						waveProgressColor: '#f39900'
					};
					//add params
					playerInstance.params(params);
				}
			);
			this.player.on('resize', function(playerInstance) {
				console.log('resize', playerInstance);
			});
			this.player.on('ready', function(playerInstance) {
				console.log('ready', playerInstance);
			});
			*/
		};
		THRONContentExperience.plugin('wse', wseThronPlugin);
	}

}

ThronComponent.meta = {
	selector: '[thron]',
	outputs: ['ready', 'canPlay', 'complete'],
	inputs: ['thron'],
};
