import { Pipe } from "rxcomp";

const DATE_FORMATS_SPLIT = /((?:[^yMLdHhmsaZEwG']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|L+|d+|H+|h+|m+|s+|a|Z|G+|w+))([\s\S]*)/;
const NUMBER_STRING = /^-?\d+$/;
const R_ISO8601_STR = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
const ALL_COLONS = /:/g;
const ZERO_CHAR = '0';

// dateFilter.$inject = ['$locale'];

const DATETIME_FORMATS_EN_US = {
	"AMPMS": [
      "AM",
      "PM"
    ],
	"DAY": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
	"MONTH": [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ],
	"SHORTDAY": [
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat"
    ],
	"SHORTMONTH": [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ],
	"fullDate": "EEEE, MMMM d, y",
	"longDate": "MMMM d, y",
	"medium": "MMM d, y h:mm:ss a",
	"mediumDate": "MMM d, y",
	"mediumTime": "h:mm:ss a",
	"short": "M/d/yy h:mm a",
	"shortDate": "M/d/yy",
	"shortTime": "h:mm a"
};

const DATETIME_FORMATS_IT_IT = {
	"AMPMS": [
      "AM",
      "PM"
    ],
	"DAY": [
      "domenica",
      "luned\u00ec",
      "marted\u00ec",
      "mercoled\u00ec",
      "gioved\u00ec",
      "venerd\u00ec",
      "sabato"
    ],
	"MONTH": [
      "gennaio",
      "febbraio",
      "marzo",
      "aprile",
      "maggio",
      "giugno",
      "luglio",
      "agosto",
      "settembre",
      "ottobre",
      "novembre",
      "dicembre"
    ],
	"SHORTDAY": [
      "dom",
      "lun",
      "mar",
      "mer",
      "gio",
      "ven",
      "sab"
    ],
	"SHORTMONTH": [
      "gen",
      "feb",
      "mar",
      "apr",
      "mag",
      "giu",
      "lug",
      "ago",
      "set",
      "ott",
      "nov",
      "dic"
    ],
	"fullDate": "EEEE d MMMM y",
	"longDate": "dd MMMM y",
	"medium": "dd/MMM/y HH:mm:ss",
	"mediumDate": "dd/MMM/y",
	"mediumTime": "HH:mm:ss",
	"short": "dd/MM/yy HH:mm",
	"shortDate": "dd/MM/yy",
	"shortTime": "HH:mm"
};

export default class DatePipe extends Pipe {

	static isNumber(value) {
		return typeof value === 'number' && isFinite(value);
	}

	static padNumber(num, digits, trim, negWrap) {
		var neg = '';
		if (num < 0 || (negWrap && num <= 0)) {
			if (negWrap) {
				num = -num + 1;
			} else {
				num = -num;
				neg = '-';
			}
		}
		num = '' + num;
		while (num.length < digits) num = ZERO_CHAR + num;
		if (trim) {
			num = num.substr(num.length - digits);
		}
		return neg + num;
	}

	static dateGetter(name, size, offset, trim, negWrap) {
		offset = offset || 0;
		return function(date) {
			var value = date['get' + name]();
			if (offset > 0 || value > -offset) {
				value += offset;
			}
			if (value === 0 && offset === -12) value = 12;
			return DatePipe.padNumber(value, size, trim, negWrap);
		};
	}

	static dateStrGetter(name, shortForm, standAlone) {
		return function(date, formats) {
			var value = date['get' + name]();
			var propPrefix = (standAlone ? 'STANDALONE' : '') + (shortForm ? 'SHORT' : '');
			var get = (propPrefix + name).toUpperCase();
			return formats[get][value];
		};
	}

	static timeZoneGetter(date, formats, offset) {
		var zone = -1 * offset;
		var paddedZone = (zone >= 0) ? '+' : '';
		paddedZone += DatePipe.padNumber(Math[zone > 0 ? 'floor' : 'ceil'](zone / 60), 2) + DatePipe.padNumber(Math.abs(zone % 60), 2);
		return paddedZone;
	}

	static getFirstThursdayOfYear(year) {
		// 0 = index of January
		var dayOfWeekOnFirst = (new Date(year, 0, 1)).getDay();
		// 4 = index of Thursday (+1 to account for 1st = 5)
		// 11 = index of *next* Thursday (+1 account for 1st = 12)
		return new Date(year, 0, ((dayOfWeekOnFirst <= 4) ? 5 : 12) - dayOfWeekOnFirst);
	}

	static getThursdayThisWeek(datetime) {
		return new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate() + (4 - datetime.getDay())); // 4 = index of Thursday
	}

	static weekGetter(size) {
		return function(date) {
			var firstThurs = DatePipe.getFirstThursdayOfYear(date.getFullYear()),
				thisThurs = DatePipe.getThursdayThisWeek(date);
			var diff = +thisThurs - +firstThurs,
				result = 1 + Math.round(diff / 6.048e8); // 6.048e8 ms per week
			return padNumber(result, size);
		};
	}

	static ampmGetter(date, formats) {
		return date.getHours() < 12 ? formats.AMPMS[0] : formats.AMPMS[1];
	}

	static eraGetter(date, formats) {
		return date.getFullYear() <= 0 ? formats.ERAS[0] : formats.ERAS[1];
	}

	static longEraGetter(date, formats) {
		return date.getFullYear() <= 0 ? formats.ERANAMES[0] : formats.ERANAMES[1];
	}

	static jsonStringToDate(string) {
		let match;
		if ((match = string.match(R_ISO8601_STR))) {
			let tzHour = 0;
			let tzMin = 0;
			if (match[9]) {
				tzHour = parseInt(match[9] + match[10]);
				tzMin = parseInt(match[9] + match[11]);
			}
			const date = new Date(0);
			const dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear;
			const timeSetter = match[8] ? date.setUTCHours : date.setHours;
			dateSetter.call(date, parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
			const h = parseInt(match[4] || 0) - tzHour;
			const m = parseInt(match[5] || 0) - tzMin;
			const s = parseInt(match[6] || 0);
			const ms = Math.round(parseFloat('0.' + (match[7] || 0)) * 1000);
			timeSetter.call(date, h, m, s, ms);
			return date;
		}
		return string;
	}

	static timezoneToOffset(timezone, fallback) {
		// Support: IE 9-11 only, Edge 13-15+
		// IE/Edge do not "understand" colon (`:`) in timezone
		timezone = timezone.replace(ALL_COLONS, '');
		var requestedTimezoneOffset = Date.parse('Jan 01, 1970 00:00:00 ' + timezone) / 60000;
		return Number.isNaN(requestedTimezoneOffset) ? fallback : requestedTimezoneOffset;
	}

	static addDateMinutes(date, minutes) {
		date = new Date(date.getTime());
		date.setMinutes(date.getMinutes() + minutes);
		return date;
	}

	static convertTimezoneToLocal(date, timezone, reverse) {
		reverse = reverse ? -1 : 1;
		var dateTimezoneOffset = date.getTimezoneOffset();
		var timezoneOffset = DatePipe.timezoneToOffset(timezone, dateTimezoneOffset);
		return DatePipe.addDateMinutes(date, reverse * (timezoneOffset - dateTimezoneOffset));
	}

	static transform_(value, locale = 'it-IT-u-ca-gregory', options = {
		dateStyle: 'short',
		timeStyle: 'short',
	}) {
		const localeDateString = new Date(value).toLocaleDateString(locale, options);
		return localeDateString;
	}

	static transform(date, format, timezone) {
		let text = '',
			match;
		let parts = [];
		format = format || 'mediumDate';
		format = DatePipe.DATETIME_FORMATS[format] || format;
		if (typeof date === 'string') {
			date = NUMBER_STRING.test(date) ? parseInt(date) : DatePipe.jsonStringToDate(date);
		}
		if (DatePipe.isNumber(date)) {
			date = new Date(date);
		}
		if (!(date instanceof Date) || !isFinite(date.getTime())) {
			return date;
		}
		while (format) {
			match = DATE_FORMATS_SPLIT.exec(format);
			if (match) {
				// parts = concat(parts, match, 1);
				parts = parts.concat(match.slice(1));
				format = parts.pop();
			} else {
				parts.push(format);
				format = null;
			}
		}
		let dateTimezoneOffset = date.getTimezoneOffset();
		if (timezone) {
			dateTimezoneOffset = DatePipe.timezoneToOffset(timezone, dateTimezoneOffset);
			date = DatePipe.convertTimezoneToLocal(date, timezone, true);
		}
		parts.forEach(function(value) {
			const formatter = DatePipe.DATE_FORMATS[value];
			text += formatter ? formatter(date, DatePipe.DATETIME_FORMATS, dateTimezoneOffset) : value === '\'\'' ? '\'' : value.replace(/(^'|'$)/g, '').replace(/''/g, '\'');
		});
		return text;
	}

}

DatePipe.DATE_FORMATS = {
	yyyy: DatePipe.dateGetter('FullYear', 4, 0, false, true),
	yy: DatePipe.dateGetter('FullYear', 2, 0, true, true),
	y: DatePipe.dateGetter('FullYear', 1, 0, false, true),
	MMMM: DatePipe.dateStrGetter('Month'),
	MMM: DatePipe.dateStrGetter('Month', true),
	MM: DatePipe.dateGetter('Month', 2, 1),
	M: DatePipe.dateGetter('Month', 1, 1),
	LLLL: DatePipe.dateStrGetter('Month', false, true),
	dd: DatePipe.dateGetter('Date', 2),
	d: DatePipe.dateGetter('Date', 1),
	HH: DatePipe.dateGetter('Hours', 2),
	H: DatePipe.dateGetter('Hours', 1),
	hh: DatePipe.dateGetter('Hours', 2, -12),
	h: DatePipe.dateGetter('Hours', 1, -12),
	mm: DatePipe.dateGetter('Minutes', 2),
	m: DatePipe.dateGetter('Minutes', 1),
	ss: DatePipe.dateGetter('Seconds', 2),
	s: DatePipe.dateGetter('Seconds', 1),
	// while ISO 8601 requires fractions to be prefixed with `.` or `,`
	// we can be just safely rely on using `sss` since we currently don't support single or two digit fractions
	sss: DatePipe.dateGetter('Milliseconds', 3),
	EEEE: DatePipe.dateStrGetter('Day'),
	EEE: DatePipe.dateStrGetter('Day', true),
	a: DatePipe.ampmGetter,
	Z: DatePipe.timeZoneGetter,
	ww: DatePipe.weekGetter(2),
	w: DatePipe.weekGetter(1),
	G: DatePipe.eraGetter,
	GG: DatePipe.eraGetter,
	GGG: DatePipe.eraGetter,
	GGGG: DatePipe.longEraGetter
};

DatePipe.DATETIME_FORMATS = DATETIME_FORMATS_IT_IT;

DatePipe.meta = {
	name: 'date',
};

/**
   *   Formats `date` to a string based on the requested `format`.
   *
   *   `format` string can be composed of the following elements:
   *
   *   * `'yyyy'`: 4 digit representation of year (e.g. AD 1 => 0001, AD 2010 => 2010)
   *   * `'yy'`: 2 digit representation of year, padded (00-99). (e.g. AD 2001 => 01, AD 2010 => 10)
   *   * `'y'`: 1 digit representation of year, e.g. (AD 1 => 1, AD 199 => 199)
   *   * `'MMMM'`: Month in year (January-December)
   *   * `'MMM'`: Month in year (Jan-Dec)
   *   * `'MM'`: Month in year, padded (01-12)
   *   * `'M'`: Month in year (1-12)
   *   * `'LLLL'`: Stand-alone month in year (January-December)
   *   * `'dd'`: Day in month, padded (01-31)
   *   * `'d'`: Day in month (1-31)
   *   * `'EEEE'`: Day in Week,(Sunday-Saturday)
   *   * `'EEE'`: Day in Week, (Sun-Sat)
   *   * `'HH'`: Hour in day, padded (00-23)
   *   * `'H'`: Hour in day (0-23)
   *   * `'hh'`: Hour in AM/PM, padded (01-12)
   *   * `'h'`: Hour in AM/PM, (1-12)
   *   * `'mm'`: Minute in hour, padded (00-59)
   *   * `'m'`: Minute in hour (0-59)
   *   * `'ss'`: Second in minute, padded (00-59)
   *   * `'s'`: Second in minute (0-59)
   *   * `'sss'`: Millisecond in second, padded (000-999)
   *   * `'a'`: AM/PM marker
   *   * `'Z'`: 4 digit (+sign) representation of the timezone offset (-1200-+1200)
   *   * `'ww'`: Week of year, padded (00-53). Week 01 is the week with the first Thursday of the year
   *   * `'w'`: Week of year (0-53). Week 1 is the week with the first Thursday of the year
   *   * `'G'`, `'GG'`, `'GGG'`: The abbreviated form of the era string (e.g. 'AD')
   *   * `'GGGG'`: The long form of the era string (e.g. 'Anno Domini')
   *
   *   `format` string can also be one of the following predefined
   *   {@link guide/i18n localizable formats}:
   *
   *   * `'medium'`: equivalent to `'MMM d, y h:mm:ss a'` for en_US locale
   *     (e.g. Sep 3, 2010 12:05:08 PM)
   *   * `'short'`: equivalent to `'M/d/yy h:mm a'` for en_US  locale (e.g. 9/3/10 12:05 PM)
   *   * `'fullDate'`: equivalent to `'EEEE, MMMM d, y'` for en_US  locale
   *     (e.g. Friday, September 3, 2010)
   *   * `'longDate'`: equivalent to `'MMMM d, y'` for en_US  locale (e.g. September 3, 2010)
   *   * `'mediumDate'`: equivalent to `'MMM d, y'` for en_US  locale (e.g. Sep 3, 2010)
   *   * `'shortDate'`: equivalent to `'M/d/yy'` for en_US locale (e.g. 9/3/10)
   *   * `'mediumTime'`: equivalent to `'h:mm:ss a'` for en_US locale (e.g. 12:05:08 PM)
   *   * `'shortTime'`: equivalent to `'h:mm a'` for en_US locale (e.g. 12:05 PM)
   *
   *   `format` string can contain literal values. These need to be escaped by surrounding with single quotes (e.g.
   *   `"h 'in the morning'"`). In order to output a single quote, escape it - i.e., two single quotes in a sequence
   *   (e.g. `"h 'o''clock'"`).
   *
   *   Any other characters in the `format` string will be output as-is.
   *
   * @param {(Date|number|string)} date Date to format either as Date object, milliseconds (string or
   *    number) or various ISO 8601 datetime string formats (e.g. yyyy-MM-ddTHH:mm:ss.sssZ and its
   *    shorter versions like yyyy-MM-ddTHH:mmZ, yyyy-MM-dd or yyyyMMddTHHmmssZ). If no timezone is
   *    specified in the string input, the time is considered to be in the local timezone.
   * @param {string=} format Formatting rules (see Description). If not specified,
   *    `mediumDate` is used.
   * @param {string=} timezone Timezone to be used for formatting. It understands UTC/GMT and the
   *    continental US time zone abbreviations, but for general use, use a time zone offset, for
   *    example, `'+0430'` (4 hours, 30 minutes east of the Greenwich meridian)
   *    If not specified, the timezone of the browser will be used.
   * @returns {string} Formatted string or the input if input is not recognized as date/millis.
   *
   * @example
	 <example name="filter-date">
	   <file name="index.html">
		 <span ng-non-bindable>{{1288323623006 | date:'medium'}}</span>:
			 <span>{{1288323623006 | date:'medium'}}</span><br>
		 <span ng-non-bindable>{{1288323623006 | date:'yyyy-MM-dd HH:mm:ss Z'}}</span>:
			<span>{{1288323623006 | date:'yyyy-MM-dd HH:mm:ss Z'}}</span><br>
		 <span ng-non-bindable>{{1288323623006 | date:'MM/dd/yyyy @ h:mma'}}</span>:
			<span>{{'1288323623006' | date:'MM/dd/yyyy @ h:mma'}}</span><br>
		 <span ng-non-bindable>{{1288323623006 | date:"MM/dd/yyyy 'at' h:mma"}}</span>:
			<span>{{'1288323623006' | date:"MM/dd/yyyy 'at' h:mma"}}</span><br>
	   </file>
	   <file name="protractor.js" type="protractor">
		 it('should format date', function() {
		   expect(element(by.binding("1288323623006 | date:'medium'")).getText()).
			  toMatch(/Oct 2\d, 2010 \d{1,2}:\d{2}:\d{2} (AM|PM)/);
		   expect(element(by.binding("1288323623006 | date:'yyyy-MM-dd HH:mm:ss Z'")).getText()).
			  toMatch(/2010-10-2\d \d{2}:\d{2}:\d{2} (-|\+)?\d{4}/);
		   expect(element(by.binding("'1288323623006' | date:'MM/dd/yyyy @ h:mma'")).getText()).
			  toMatch(/10\/2\d\/2010 @ \d{1,2}:\d{2}(AM|PM)/);
		   expect(element(by.binding("'1288323623006' | date:\"MM/dd/yyyy 'at' h:mma\"")).getText()).
			  toMatch(/10\/2\d\/2010 at \d{1,2}:\d{2}(AM|PM)/);
		 });
	   </file>
	 </example>
   */
