import { Component } from 'rxcomp';
import { interval, Subject } from 'rxjs';
import { startWith, takeUntil, tap } from 'rxjs/operators';

export const EventDateMode = {
	Live: 'live',
	Countdown: 'countdown',
	WatchRelative: 'watchRelative',
	Relative: 'relative',
	Date: 'date',
};

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;

const to10 = (value) => {
	return (value < 10) ? '0' + value : value;
};

export default class EventDateComponent extends Component {

	get mode() {
		return this.mode_;
	}

	set mode(mode) {
		if (this.mode_ !== mode) {
			this.mode_ = mode;
			this.change.next(this.eventDate);
		}
	}

	static hoursDiff(date) {
		const now = new Date();
		const diff = date - now;
		const hoursDiff = Math.abs(Math.floor(diff / 1000 / 60 / 60));
		return hoursDiff;
	}

	static getMode(item) {
		if (!item.past && !item.info.started) {
			const now = new Date();
			if (now > item.startDate) {
				item.info.started = true;
			}
		}
		if (item.live) {
			return EventDateMode.Live;
		} else if (item.incoming) {
			return EventDateMode.Countdown;
		}
		const hoursDiff = EventDateComponent.hoursDiff(item.startDate);
		if (item.past && hoursDiff < 24) {
			return EventDateMode.WatchRelative;
		} else if (hoursDiff < 24 * 14) {
			return EventDateMode.Relative;
		} else {
			return EventDateMode.Date;
		}
	}

	onInit() {
		this.mode_ = EventDateComponent.getMode(this.eventDate);
		this.countdown = '';
		this.live$ = new Subject();
		this.change$().pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(() => {
			this.mode = EventDateComponent.getMode(this.eventDate);
			if (this.mode === EventDateMode.Countdown || this.mode === EventDateMode.WatchRelative) {
				this.pushChanges();
			}
		});
	}

	/*
	onChange() {
		this.mode = EventDateComponent.getMode(this.eventDate);
	}
	*/

	change$() {
		return interval(1000).pipe(
			takeUntil(this.live$),
			startWith(0),
			tap(() => {
				if (this.mode === EventDateMode.Countdown) {
					let diff = this.eventDate.startDate - new Date();
					const hh = Math.floor(diff / HOUR);
					diff -= hh * HOUR;
					const mm = Math.floor(diff / MINUTE);
					diff -= mm * MINUTE;
					const ss = Math.floor(diff / SECOND);
					diff -= ss * SECOND;
					this.countdown = `-${to10(hh)}:${to10(mm)}:${to10(ss)}`;
					if (diff < 0) {
						this.eventDate.info.started = true;
						// this.live$.next();
					}
				}
			})
		);
	}

}

EventDateComponent.meta = {
	selector: '[eventDate]',
	outputs: ['change'],
	inputs: ['eventDate']
};
