import LocaleService, { LocaleDay, LocaleDayPeriod, LocaleEra, LocaleLength, LocaleMonth, LocaleNumberSymbol, LocaleStyle, LocaleType } from '../locale/locale.service';

export const NumberFormatStyle_ = {
	Decimal: 'decimal',
	Percent: 'percent',
	Currency: 'currency',
	Scientific: 'scientific',
};

export const Plural_ = {
	Zero: 0,
	One: 1,
	Two: 2,
	Few: 3,
	Many: 4,
	Other: 5,
};

export const TimezoneLength = {
	Short: 'short',
	ShortGMT: 'shortGmt',
	Long: 'long',
	Extended: 'extended',
};

export const DatePart = {
	FullYear: 'fullYear',
	Month: 'month',
	Date: 'date',
	Hours: 'hours',
	Minutes: 'minutes',
	Seconds: 'seconds',
	Milliseconds: 'milliseconds',
	Day: 'day',
};

/*
// Converts a value to date. Throws if unable to convert to a date.
export const ISO8601_DATE_REGEX = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
export function parseDate(value) {
	if (isDate(value)) {
		return value;
	}
	if (typeof value === 'number' && !isNaN(value)) {
		return new Date(value);
	}
	if (typeof value === 'string') {
		value = value.trim();
		const parsedNb = parseFloat(value);
		// any string that only contains numbers, like '1234' but not like '1234hello'
		if (!isNaN(value - parsedNb)) {
			return new Date(parsedNb);
		}
		if (/^(\d{4}-\d{1,2}-\d{1,2})$/.test(value)) {
			// For ISO Strings without time the day, month and year must be extracted from the ISO String
      // before Date creation to avoid time offset and errors in the new Date.
      // If we only replace '-' with ',' in the ISO String ('2015,01,01'), and try to create a new
      // date, some browsers (e.g. IE 9) will throw an invalid Date error.
      // If we leave the '-' ('2015-01-01') and try to create a new Date('2015-01-01') the timeoffset
      // is applied.
      // Note: ISO months are 0 for January, 1 for February, ...
			const [y, m, d] = value.split('-').map(val => +val);
			return new Date(y, m - 1, d);
		}
		const match = value.match(ISO8601_DATE_REGEX);
		if (match) {
			return isoStringToDate(match);
		}
	}
	const date = new Date(value);
	if (!isDate(date)) {
		throw new Error(`Unable to convert "${value}" into a date`);
	}
	return date;
}

// Converts a date in ISO8601 to a Date. Used instead of `Date.parse` because of browser discrepancies.
export function isoStringToDate(match) {
	const date = new Date(0);
	let tzHour = 0;
	let tzMin = 0;
	// match[8] means that the string contains 'Z' (UTC) or a timezone like '+01:00' or '+0100'
	const dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear;
	const timeSetter = match[8] ? date.setUTCHours : date.setHours;
	// if there is a timezone defined like '+01:00' or '+0100'
	if (match[9]) {
		tzHour = Number(match[9] + match[10]);
		tzMin = Number(match[9] + match[11]);
	}
	dateSetter.call(date, Number(match[1]), Number(match[2]) - 1, Number(match[3]));
	const h = Number(match[4] || 0) - tzHour;
	const m = Number(match[5] || 0) - tzMin;
	const s = Number(match[6] || 0);
	const ms = Math.round(parseFloat('0.' + (match[7] || 0)) * 1000);
	timeSetter.call(date, h, m, s, ms);
	return date;
}

export function isDate(value) {
	return value instanceof Date && !isNaN(value.valueOf());
}
*/

function padNumber(num, digits, minusSign = '-', trim, negWrap) {
	let neg = '';
	if (negWrap && num <= 0) {
		num = -num + 1;
	} else if (num < 0) {
		num = -num;
		neg = minusSign;
	}
	let strNum = String(num);
	while (strNum.length < digits) {
		strNum = '0' + strNum;
	}
	if (trim) {
		strNum = strNum.substr(strNum.length - digits);
	}
	return neg + strNum;
}

const FORMAT_SPLITTER_REGEX = /((?:[^GyMLwWdEabBhHmsSzZO']+)|(?:'(?:[^']|'')*')|(?:G{1,5}|y{1,4}|M{1,5}|L{1,5}|w{1,2}|W{1}|d{1,2}|E{1,6}|a{1,5}|b{1,5}|B{1,5}|h{1,2}|H{1,2}|m{1,2}|s{1,2}|S{1,3}|z{1,4}|Z{1,5}|O{1,4}))([\s\S]*)/;
const JANUARY = 0;
const THURSDAY = 4;

export default class DateTimeService {
	static getDatePart(part, date) {
		switch (part) {
			case DatePart.FullYear:
				return date.getFullYear();
			case DatePart.Month:
				return date.getMonth();
			case DatePart.Date:
				return date.getDate();
			case DatePart.Day:
				return date.getDay();
			case DatePart.Hours:
				return date.getHours();
			case DatePart.Minutes:
				return date.getMinutes();
			case DatePart.Seconds:
				return date.getSeconds();
			case DatePart.Milliseconds:
				return date.getMilliseconds();
			default:
				throw new Error(`Unknown DatePart value "${part}".`);
		}
	}

	static formatMilliseconds(milliseconds, digits) {
		const strMs = padNumber(milliseconds, 3);
		return strMs.substr(0, digits);
	}

	static getDateFormatter(name, digits, offset = 0, trim = false, negWrap = false) {
		return function(date, locale) {
			let part = DateTimeService.getDatePart(name, date);
			if (offset > 0 || part > -offset) {
				part += offset;
			}
			if (name === DatePart.Hours) {
				if (part === 0 && offset === -12) {
					part = 12;
				}
			} else if (name === DatePart.Milliseconds) {
				return DateTimeService.formatMilliseconds(part, digits);
			}
			const localeMinus = LocaleService.getLocale(LocaleType.NumberSymbols, LocaleNumberSymbol.MinusSign);
			return padNumber(part, digits, localeMinus, trim, negWrap);
		};
	}

	static getDateTranslation(date, name, width, extended) {
		let locale;
		switch (name) {
			case LocaleType.Days:
				return LocaleService.getLocale(LocaleType.Days, width, Object.values(LocaleDay)[date.getDay()]);
			// return getLocaleDayNames(width)[Object.values(LocaleDay)[date.getDay()]];
			case LocaleType.Months:
				return LocaleService.getLocale(LocaleType.Months, width, Object.values(LocaleMonth)[date.getMonth()]);
			case LocaleType.DayPeriods:
				const currentHours = date.getHours();
				/*
				const currentMinutes = date.getMinutes();
				if (extended) {
					const rules = getLocaleExtraDayPeriodRules();
					const dayPeriods = getLocaleExtraDayPeriods(width);
					const index = rules.findIndex(rule => {
						if (Array.isArray(rule)) {
							// morning, afternoon, evening, night
							const [from, to] = rule;
							const afterFrom = currentHours >= from.hours && currentMinutes >= from.minutes;
							const beforeTo = currentHours < to.hours || (currentHours === to.hours && currentMinutes < to.minutes);
							// We must account for normal rules that span a period during the day (e.g. 6am-9am)
							// where `from` is less (earlier) than `to`. But also rules that span midnight (e.g.
							// 10pm - 5am) where `from` is greater (later!) than `to`.
							//
							// In the first case the current time must be BOTH after `from` AND before `to`
							// (e.g. 8am is after 6am AND before 10am).
							//
							// In the second case the current time must be EITHER after `from` OR before `to`
							// (e.g. 4am is before 5am but not after 10pm; and 11pm is not before 5am but it is
							// after 10pm).
							if (from.hours < to.hours) {
								if (afterFrom && beforeTo) {
									return true;
								}
							} else if (afterFrom || beforeTo) {
								return true;
							}
						} else {
							// noon or midnight
							if (rule.hours === currentHours && rule.minutes === currentMinutes) {
								return true;
							}
						}
						return false;
					});
					if (index !== -1) {
						return dayPeriods[index];
					}
				}
				*/
				// if no rules for the day periods, we use am/pm by default
				return LocaleService.getLocale(LocaleType.DayPeriods, width, currentHours < 12 ? LocaleDayPeriod.AM : LocaleDayPeriod.PM);
			case LocaleType.Eras:
				return LocaleService.getLocale(LocaleType.Eras, width, date.getFullYear() <= 0 ? LocaleEra.BC : LocaleEra.AD);
			default:
				throw new Error(`unknown translation type ${name}`);
		}
	}

	static getDateLocaleFormatter(name, width, extended = false) {
		return function(date) {
			return DateTimeService.getDateTranslation(date, name, width, extended);
		};
	}

	static getWeekFirstThursdayOfYear(year) {
		const firstDayOfYear = new Date(year, JANUARY, 1).getDay();
		return new Date(year, 0, 1 + (firstDayOfYear <= THURSDAY ? THURSDAY : THURSDAY + 7) - firstDayOfYear);
	}

	static getWeekThursday(datetime) {
		return new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate() + (THURSDAY - datetime.getDay()));
	}

	static getWeekFormatter(digits, monthBased = false) {
		return function(date, locale) {
			let result;
			if (monthBased) {
				const nbDaysBefore1stDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay() - 1;
				const today = date.getDate();
				result = 1 + Math.floor((today + nbDaysBefore1stDayOfMonth) / 7);
			} else {
				const firstThurs = DateTimeService.getWeekFirstThursdayOfYear(date.getFullYear());
				const thisThurs = DateTimeService.getWeekThursday(date);
				const diff = thisThurs.getTime() - firstThurs.getTime();
				result = 1 + Math.round(diff / 6.048e8); // 6.048e8 ms per week
			}
			return padNumber(result, digits, LocaleService.getLocale(LocaleType.NumberSymbols, LocaleNumberSymbol.MinusSign));
		};
	}

	static getTimezoneFormatter(width) {
		return function(date, offset) {
			const zone = -1 * offset;
			const minusSign = LocaleService.getLocale(LocaleType.NumberSymbols, LocaleNumberSymbol.MinusSign);
			const hours = zone > 0 ? Math.floor(zone / 60) : Math.ceil(zone / 60);
			switch (width) {
				case TimezoneLength.Short:
					return (zone >= 0 ? '+' : '') + padNumber(hours, 2, minusSign) + padNumber(Math.abs(zone % 60), 2, minusSign);
				case TimezoneLength.ShortGMT:
					return 'GMT' + (zone >= 0 ? '+' : '') + padNumber(hours, 1, minusSign);
				case TimezoneLength.Long:
					return 'GMT' + (zone >= 0 ? '+' : '') + padNumber(hours, 2, minusSign) + ':' + padNumber(Math.abs(zone % 60), 2, minusSign);
				case TimezoneLength.Extended:
					if (offset === 0) {
						return 'Z';
					} else {
						return (zone >= 0 ? '+' : '') + padNumber(hours, 2, minusSign) + ':' + padNumber(Math.abs(zone % 60), 2, minusSign);
					}
				default:
					throw new Error(`Unknown zone width "${width}"`);
			}
		};
	}

	// Based on CLDR formats:
	// See complete list: http://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
	// See also explanations: http://cldr.unicode.org/translation/date-time
	// TODO(ocombe): support all missing cldr formats: Y, U, Q, D, F, e, c, j, J, C, A, v, V, X, x
	// const CACHED_FORMATTERS = {};
	static getFormatter(format) {
		/*
	// cache
	if (CACHED_FORMATTERS[format]) {
		return CACHED_FORMATTERS[format];
	}
	*/
		let formatter;
		switch (format) {
			// 1 digit representation of the year, e.g. (AD 1 => 1, AD 199 => 199)
			case 'y':
				formatter = DateTimeService.getDateFormatter(DatePart.FullYear, 1, 0, false, true);
				break;
			// 2 digit representation of the year, padded (00-99). (e.g. AD 2001 => 01, AD 2010 => 10)
			case 'yy':
				formatter = DateTimeService.getDateFormatter(DatePart.FullYear, 2, 0, true, true);
				break;
			// 3 digit representation of the year, padded (000-999). (e.g. AD 2001 => 01, AD 2010 => 10)
			case 'yyy':
				formatter = DateTimeService.getDateFormatter(DatePart.FullYear, 3, 0, false, true);
				break;
			// 4 digit representation of the year (e.g. AD 1 => 0001, AD 2010 => 2010)
			case 'yyyy':
				formatter = DateTimeService.getDateFormatter(DatePart.FullYear, 4, 0, false, true);
				break;
			// Month of the year (1-12), numeric
			case 'M':
			case 'L':
				formatter = DateTimeService.getDateFormatter(DatePart.Month, 1, 1);
				break;
			case 'MM':
			case 'LL':
				formatter = DateTimeService.getDateFormatter(DatePart.Month, 2, 1);
				break;
			// Day of the month (1-31)
			case 'd':
				formatter = DateTimeService.getDateFormatter(DatePart.Date, 1);
				break;
			case 'dd':
				formatter = DateTimeService.getDateFormatter(DatePart.Date, 2);
				break;
			// Hour in AM/PM, (1-12)
			case 'h':
				formatter = DateTimeService.getDateFormatter(DatePart.Hours, 1, -12);
				break;
			case 'hh':
				formatter = DateTimeService.getDateFormatter(DatePart.Hours, 2, -12);
				break;
			// Hour of the day (0-23)
			case 'H':
				formatter = DateTimeService.getDateFormatter(DatePart.Hours, 1);
				break;
			// Hour in day, padded (00-23)
			case 'HH':
				formatter = DateTimeService.getDateFormatter(DatePart.Hours, 2);
				break;
			// Minute of the hour (0-59)
			case 'm':
				formatter = DateTimeService.getDateFormatter(DatePart.Minutes, 1);
				break;
			case 'mm':
				formatter = DateTimeService.getDateFormatter(DatePart.Minutes, 2);
				break;
			// Second of the minute (0-59)
			case 's':
				formatter = DateTimeService.getDateFormatter(DatePart.Seconds, 1);
				break;
			case 'ss':
				formatter = DateTimeService.getDateFormatter(DatePart.Seconds, 2);
				break;
			// Fractional second
			case 'S':
				formatter = DateTimeService.getDateFormatter(DatePart.Milliseconds, 1);
				break;
			case 'SS':
				formatter = DateTimeService.getDateFormatter(DatePart.Milliseconds, 2);
				break;
			case 'SSS':
				formatter = DateTimeService.getDateFormatter(DatePart.Milliseconds, 3);
				break;
			// Month of the year (January, ...), string, format
			case 'MMM':
				formatter = DateTimeService.getDateLocaleFormatter(LocaleType.Months, LocaleLength.Abbreviated);
				break;
			case 'MMMM':
				formatter = DateTimeService.getDateLocaleFormatter(LocaleType.Months, LocaleLength.Wide);
				break;
			case 'MMMMM':
				formatter = DateTimeService.getDateLocaleFormatter(LocaleType.Months, LocaleLength.Narrow);
				break;
			// Month of the year (January, ...), string, standalone
			case 'LLL':
				formatter = DateTimeService.getDateLocaleFormatter(LocaleType.Months, LocaleLength.Abbreviated, FormStyle.Standalone);
				break;
			case 'LLLL':
				formatter = DateTimeService.getDateLocaleFormatter(LocaleType.Months, LocaleLength.Wide, FormStyle.Standalone);
				break;
			case 'LLLLL':
				formatter = DateTimeService.getDateLocaleFormatter(LocaleType.Months, LocaleLength.Narrow, FormStyle.Standalone);
				break;
			// Day of the Week
			case 'E':
			case 'EE':
			case 'EEE':
				formatter = DateTimeService.getDateLocaleFormatter(LocaleType.Days, LocaleLength.Abbreviated);
				break;
			case 'EEEE':
				formatter = DateTimeService.getDateLocaleFormatter(LocaleType.Days, LocaleLength.Wide);
				break;
			case 'EEEEE':
				formatter = DateTimeService.getDateLocaleFormatter(LocaleType.Days, LocaleLength.Narrow);
				break;
			case 'EEEEEE':
				formatter = DateTimeService.getDateLocaleFormatter(LocaleType.Days, LocaleLength.Short);
				break;
			// Generic period of the day (am-pm)
			case 'a':
			case 'aa':
			case 'aaa':
				formatter = DateTimeService.getDateLocaleFormatter(LocaleType.DayPeriods, LocaleLength.Abbreviated);
				break;
			case 'aaaa':
				formatter = DateTimeService.getDateLocaleFormatter(LocaleType.DayPeriods, LocaleLength.Wide);
				break;
			case 'aaaaa':
				formatter = DateTimeService.getDateLocaleFormatter(LocaleType.DayPeriods, LocaleLength.Narrow);
				break;
			// Extended period of the day (midnight, at night, ...), standalone
			case 'b':
			case 'bb':
			case 'bbb':
				formatter = DateTimeService.getDateLocaleFormatter(LocaleType.DayPeriods, LocaleLength.Abbreviated, FormStyle.Standalone, true);
				break;
			case 'bbbb':
				formatter = DateTimeService.getDateLocaleFormatter(LocaleType.DayPeriods, LocaleLength.Wide, FormStyle.Standalone, true);
				break;
			case 'bbbbb':
				formatter = DateTimeService.getDateLocaleFormatter(LocaleType.DayPeriods, LocaleLength.Narrow, FormStyle.Standalone, true);
				break;
			// Extended period of the day (midnight, night, ...), standalone
			case 'B':
			case 'BB':
			case 'BBB':
				formatter = DateTimeService.getDateLocaleFormatter(LocaleType.DayPeriods, LocaleLength.Abbreviated, FormStyle.Format, true);
				break;
			case 'BBBB':
				formatter = DateTimeService.getDateLocaleFormatter(LocaleType.DayPeriods, LocaleLength.Wide, FormStyle.Format, true);
				break;
			case 'BBBBB':
				formatter = DateTimeService.getDateLocaleFormatter(LocaleType.DayPeriods, LocaleLength.Narrow, FormStyle.Format, true);
				break;
			// Era name (AD/BC)
			case 'GGGGG':
				formatter = DateTimeService.getDateLocaleFormatter(LocaleType.Eras, LocaleLength.Narrow);
				break;
			case 'G':
			case 'GG':
			case 'GGG':
				formatter = DateTimeService.getDateLocaleFormatter(LocaleType.Eras, LocaleLength.Abbreviated);
				break;
			case 'GGGG':
				formatter = DateTimeService.getDateLocaleFormatter(LocaleType.Eras, LocaleLength.Wide);
				break;
			// Week of the year (1, ... 52)
			case 'w':
				formatter = DateTimeService.getWeekFormatter(1);
				break;
			case 'ww':
				formatter = DateTimeService.getWeekFormatter(2);
				break;
			// Week of the month (1, ...)
			case 'W':
				formatter = DateTimeService.getWeekFormatter(1, true);
				break;
			// Timezone ISO8601 short format (-0430)
			case 'Z':
			case 'ZZ':
			case 'ZZZ':
				formatter = DateTimeService.getTimezoneFormatter(TimezoneLength.Short);
				break;
			// Timezone ISO8601 extended format (-04:30)
			case 'ZZZZZ':
				formatter = DateTimeService.getTimezoneFormatter(TimezoneLength.Extended);
				break;
			// Timezone GMT short format (GMT+4)
			case 'O':
			case 'OO':
			case 'OOO':
				formatter = DateTimeService.getTimezoneFormatter(TimezoneLength.ShortGMT);
				break;
			// Should be location, but fallback to format O instead because we don't have the data yet
			case 'z':
			case 'zz':
			case 'zzz':
				formatter = DateTimeService.getTimezoneFormatter(TimezoneLength.ShortGMT);
				break;
			// Timezone GMT long format (GMT+0430)
			case 'OOOO':
			case 'ZZZZ':
				formatter = DateTimeService.getTimezoneFormatter(TimezoneLength.Long);
				break;
			// Should be location, but fallback to format O instead because we don't have the data yet
			case 'zzzz':
				formatter = DateTimeService.getTimezoneFormatter(TimezoneLength.Long);
				break;
			default:
				return null;
		}
		/*
	// cache
	CACHED_FORMATTERS[format] = formatter;
	*/
		return formatter;
	}

	static setTimezoneOffset(timezone, fallback) {
		// Support: IE 9-11 only, Edge 13-15+
		// IE/Edge do not "understand" colon (`:`) in timezone
		timezone = timezone.replace(/:/g, '');
		const requestedTimezoneOffset = Date.parse('Jan 01, 1970 00:00:00 ' + timezone) / 60000;
		return isNaN(requestedTimezoneOffset) ? fallback : requestedTimezoneOffset;
	}

	static dateTimezoneToLocal(date, timezone, reverse) {
		const reverseValue = reverse ? -1 : 1;
		const dateTimezoneOffset = date.getTimezoneOffset();
		const timezoneOffset = DateTimeService.setTimezoneOffset(timezone, dateTimezoneOffset);
		const minutes = reverseValue * (timezoneOffset - dateTimezoneOffset);
		date = new Date(date.getTime());
		date.setMinutes(date.getMinutes() + minutes);
		return date;
	}

	static parseDate(value) {
		if (value instanceof Date) {
			return value;
		}
		return new Date(Date.parse(value));
	}

	// const CACHED_FORMATS = {};
	static getNamedFormat(format) {
		/*
	// cache
	const localeId = locale.id;
	CACHED_FORMATS[localeId] = CACHED_FORMATS[localeId] || {};
	if (CACHED_FORMATS[localeId][format]) {
		return CACHED_FORMATS[localeId][format];
	}
	*/
		let formatValue = '';
		switch (format) {
			case 'shortDate':
				formatValue = LocaleService.getLocale(LocaleType.DateFormats, LocaleStyle.Short);
				break;
			case 'mediumDate':
				formatValue = LocaleService.getLocale(LocaleType.DateFormats, LocaleStyle.Medium);
				break;
			case 'longDate':
				formatValue = LocaleService.getLocale(LocaleType.DateFormats, LocaleStyle.Long);
				break;
			case 'fullDate':
				formatValue = LocaleService.getLocale(LocaleType.DateFormats, LocaleStyle.Full);
				break;
			case 'shortTime':
				formatValue = LocaleService.getLocale(LocaleType.TimeFormats, LocaleStyle.Short);
				break;
			case 'mediumTime':
				formatValue = LocaleService.getLocale(LocaleType.TimeFormats, LocaleStyle.Medium);
				break;
			case 'longTime':
				formatValue = LocaleService.getLocale(LocaleType.TimeFormats, LocaleStyle.Long);
				break;
			case 'fullTime':
				formatValue = LocaleService.getLocale(LocaleType.TimeFormats, LocaleStyle.Full);
				break;
			case 'short':
				const shortTime = DateTimeService.getNamedFormat('shortTime');
				const shortDate = DateTimeService.getNamedFormat('shortDate');
				formatValue = `${shortTime} ${shortDate}`;
				break;
			case 'medium':
				const mediumTime = DateTimeService.getNamedFormat('mediumTime');
				const mediumDate = DateTimeService.getNamedFormat('mediumDate');
				formatValue = `${mediumTime} ${mediumDate}`;
				break;
			case 'long':
				const longTime = DateTimeService.getNamedFormat('longTime');
				const longDate = DateTimeService.getNamedFormat('longDate');
				formatValue = `${longTime} ${longDate}`;
				break;
			case 'full':
				const fullTime = DateTimeService.getNamedFormat('fullTime');
				const fullDate = DateTimeService.getNamedFormat('fullDate');
				formatValue = `${fullTime} ${fullDate}`;
				break;
			default:
		}
		/*
	// cache
	if (formatValue) {
		CACHED_FORMATS[localeId][format] = formatValue;
	}
	*/
		return formatValue;
	}

	static formatDate(value, format, timezone) {
		let date = DateTimeService.parseDate(value);
		// console.log(date);
		// named formats
		const namedFormat = DateTimeService.getNamedFormat(format);
		format = namedFormat || format;
		let formats = [];
		let match;
		while (format) {
			match = FORMAT_SPLITTER_REGEX.exec(format);
			if (match) {
				formats = formats.concat(match.slice(1));
				const part = formats.pop();
				if (!part) {
					break;
				}
				format = part;
			} else {
				formats.push(format);
				break;
			}
		}
		// console.log(formats);
		let dateTimezoneOffset = date.getTimezoneOffset();
		if (timezone) {
			dateTimezoneOffset = DateTimeService.setTimezoneOffset(timezone, dateTimezoneOffset);
			date = DateTimeService.dateTimezoneToLocal(date, timezone, true);
		}
		// console.log(dateTimezoneOffset);
		let text = '';
		formats.forEach(format => {
			const formatter = DateTimeService.getFormatter(format);
			if (formatter) {
				text += formatter(date, dateTimezoneOffset);
			} else {
				text += format === "''" ? "'" : format.replace(/(^'|'$)/g, '').replace(/''/g, "'");
			}
		});
		return text;
	}
}
