import { Pipe } from "rxcomp";
import relativeDateFactory from './factory';
import relativeDate from './tiny-relative-date';

export const RELATIVE_DATE_KEYS = ["justNow", "secondsAgo", "aMinuteAgo", "minutesAgo", "anHourAgo", "hoursAgo", "aDayAgo", "daysAgo", "aWeekAgo", "weeksAgo", "aMonthAgo", "monthsAgo", "aYearAgo", "yearsAgo", "overAYearAgo", "secondsFromNow", "aMinuteFromNow", "minutesFromNow", "anHourFromNow", "hoursFromNow", "aDayFromNow", "daysFromNow", "aWeekFromNow", "weeksFromNow", "aMonthFromNow", "monthsFromNow", "aYearFromNow", "yearsFromNow", "overAYearFromNow"];

export default class RelativeDatePipe extends Pipe {

	static transform(value) {
		if (value) {
			return this.relativeDate(value);
		}
	}

	static setLocale(locale) {
		if (!locale) return;
		const values = {};
		const keys = Object.keys(locale).filter(key => RELATIVE_DATE_KEYS.indexOf(key) !== -1);
		if (keys.length) {
			keys.forEach(key => values[key] = locale[key]);
			this.relativeDate = relativeDateFactory(values);
		}
	}

}

RelativeDatePipe.meta = {
	name: 'relativeDate',
};

RelativeDatePipe.relativeDate = relativeDate;

if (window.locale) {
	RelativeDatePipe.setLocale(window.locale);
}
