export const LocaleType = {
	DateFormats: 'dateFormats',
	TimeFormats: 'timeFormats',
	DayPeriods: 'dayPeriods',
	Days: 'days',
	Months: 'months',
	Eras: 'eras',
	NumberSymbols: 'numberSymbols',
};

export const LocaleStyle = {
	// For `en-US`, 'M/d/yy, h:mm a'` (Example: `6/15/15, 9:03 AM`)
	Short: 'short',
	// For `en-US`, `'MMM d, y, h:mm:ss a'` (Example: `Jun 15, 2015, 9:03:01 AM`)
	Medium: 'medium',
	// For `en-US`, `'MMMM d, y, h:mm:ss a z'` (Example: `June 15, 2015 at 9:03:01 AM GMT+1`)
	Long: 'long',
	// For `en-US`, `'EEEE, MMMM d, y, h:mm:ss a zzzz'` (Example: `Monday, June 15, 2015 at 9:03:01 AM GMT+01:00`)
	Full: 'full',
};

export const LocaleLength = {
	// 1 character for `en-US`. For example: 'S'
	Narrow: 'narrow',
	// 2 characters for `en-US`, For example: 'Su'
	Short: 'short',
	// 3 characters for `en-US`. For example: 'Sun'
	Abbreviated: 'abbreviated',
	// Full length for `en-US`. For example: 'Sunday'
	Wide: 'wide',
};

export const LocaleDay = {
	Sunday: 'sunday',
	Monday: 'monday',
	Tuesday: 'tuesday',
	Wednesday: 'wednesday',
	Thursday: 'thursday',
	Friday: 'friday',
	Saturday: 'saturday',
};

export const LocaleMonth = {
	January: 'january',
	February: 'february',
	March: 'march',
	April: 'april',
	May: 'may',
	June: 'june',
	July: 'july',
	August: 'august',
	September: 'september',
	October: 'october',
	November: 'november',
	December: 'december',
};

export const LocaleDayPeriod = {
	AM: 'am',
	PM: 'pm',
};

export const LocaleEra = {
	BC: 'bc',
	AD: 'ad',
};

export const LocaleNumberSymbol = {
	// Decimal separator. For `en-US`, the dot character. Example : 2,345`.`67
	Decimal: 'decimal',
	// Grouping separator, typically for thousands. For `en-US`, the comma character. Example: 2`,`345.67
	Group: 'group',
	// List-item separator. Example: 'one, two, and three'
	List: 'list',
	// Sign for percentage (out of 100). Example: 23.4%
	PercentSign: 'percentSign',
	// Sign for positive numbers. Example: +23
	PlusSign: 'plusSign',
	// Sign for negative numbers. Example: -23
	MinusSign: 'minusSign',
	// Computer notation for exponential value (n times a power of 10). Example: 1.2E3
	Exponential: 'exponential',
	// Human-readable format of exponential. Example: 1.2x103
	SuperscriptingExponent: 'superscriptingExponent',
	// Sign for permille (out of 1000). Example: 23.4‰
	PerMille: 'perMille',
	// Infinity, can be used with plus and minus. Example: ∞, +∞, -∞
	Infinity: 'infinity',
	// Not a number. Example: NaN
	NaN: 'nan',
	// Symbol used between time units. Example: 10:52
	TimeSeparator: 'timeSeparator',
	// Decimal separator for currency values (fallback to `Decimal`). Example: $2,345.67
	CurrencyDecimal: 'currencyDecimal',
	// Group separator for currency values (fallback to `Group`). Example: $2,345.67
	CurrencyGroup: 'currencyGroup',
};

const locale_en = {
	id: 'en',
	dateFormats: {
		short: 'M/d/yy',
		medium: 'MMM d, y',
		long: 'MMMM d, y',
		full: 'EEEE, MMMM d, y',
	},
	timeFormats: {
		short: 'h:mm a',
		medium: 'h:mm:ss a',
		long: 'h:mm:ss a z',
		full: 'h:mm:ss a zzzz',
	},
	dayPeriods: {
		narrow: {
			am: 'a',
			pm: 'p',
		},
		abbreviated: {
			am: 'AM',
			pm: 'PM',
		},
		wide: {
			am: 'AM',
			pm: 'PM',
		},
	},
	days: {
		narrow: { sunday: 'S', monday: 'M', tuesday: 'T', wednesday: 'W', thursday: 'T', friday: 'F', saturday: 'S' },
		short: { sunday: 'Su', monday: 'Mo', tuesday: 'Tu', wednesday: 'We', thursday: 'Th', friday: 'Fr', saturday: 'Sa' },
		abbreviated: { sunday: 'Sun', monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu', friday: 'Fri', saturday: 'Sat' },
		wide: { sunday: 'Sunday', monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday', thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday' },
	},
	months: {
		narrow: { january: 'J', february: 'F', march: 'M', april: 'A', may: 'M', june: 'J', july: 'J', august: 'A', september: 'S', october: 'O', november: 'N', december: 'D' },
		abbreviated: { january: 'Jan', february: 'Feb', march: 'Mar', april: 'Apr', may: 'May', june: 'Jun', july: 'Jul', august: 'Aug', september: 'Sep', october: 'Oct', november: 'Nov', december: 'Dec' },
		wide: { january: 'January', february: 'February', march: 'March', april: 'April', may: 'May', june: 'June', july: 'July', august: 'August', september: 'September', october: 'October', november: 'November', december: 'December' },
	},
	eras: {
		narrow: { bc: 'B', ad: 'A' },
		abbreviated: { bc: 'BC', ad: 'AD' },
		wide: { bc: 'Before Christ', ad: 'Anno Domini' },
	},
	numberSymbols: {
		decimal: '.',
		group: ',',
		list: ';',
		percentSign: '%',
		plusSign: '+',
		minusSign: '-',
		exponential: 'E',
		superscriptingExponent: '×',
		perMille: '‰',
		infinite: '∞',
		nan: 'NaN',
		timeSeparator: ':',
		// currencyDecimal: undefined, // fallback to decimal
		// currencyGroup: undefined, // fallback to group
	},
};

const locale_it = {
	id: 'it',
	dateFormats: {
		short: 'dd/MM/yy',
		medium: 'd MMM y',
		long: 'd MMMM y',
		full: 'EEEE d MMMM y',
	},
	timeFormats: {
		short: 'HH:mm',
		medium: 'HH:mm:ss',
		long: 'HH:mm:ss z',
		full: 'HH:mm:ss zzzz'
	},
	dayPeriods: {
		narrow: {
			am: 'm',
			pm: 'p',
		},
		abbreviated: {
			am: 'AM',
			pm: 'PM',
		},
		wide: {
			am: 'AM',
			pm: 'PM',
		},
	},
	days: {
		narrow: { sunday: 'D', monday: 'L', tuesday: 'M', wednesday: 'M', thursday: 'G', friday: 'V', saturday: 'S' },
		short: { sunday: 'Do', monday: 'Lu', tuesday: 'Ma', wednesday: 'Me', thursday: 'Gi', friday: 'Ve', saturday: 'Sa' },
		abbreviated: { sunday: 'Dom', monday: 'Lun', tuesday: 'Mar', wednesday: 'Mer', thursday: 'Gio', friday: 'Ven', saturday: 'Sab' },
		wide: { sunday: 'Domenica', monday: 'Lunedì', tuesday: 'Martedì', wednesday: 'Mercoledì', thursday: 'Giovedì', friday: 'Venerdì', saturday: 'Sabato' },
	},
	months: {
		narrow: { january: 'G', february: 'F', march: 'M', april: 'A', may: 'M', june: 'G', july: 'L', august: 'A', september: 'S', october: 'O', november: 'N', december: 'D' },
		abbreviated: { january: 'Gen', february: 'Feb', march: 'Mar', april: 'Apr', may: 'Mag', june: 'Giu', july: 'Lug', august: 'Ago', september: 'Set', october: 'Ott', november: 'Nov', december: 'Dic' },
		wide: { january: 'Gennaio', february: 'Febbraio', march: 'Marzo', april: 'Aprile', may: 'Maggio', june: 'Giugno', july: 'Luglio', august: 'Agosto', september: 'Settembre', october: 'Ottobre', november: 'Novembre', december: 'Dicembre' },
	},
	eras: {
		narrow: { bc: 'aC', ad: 'dC' },
		abbreviated: { bc: 'a.C.', ad: 'd.C.' },
		wide: { bc: 'avanti Cristo', ad: 'dopo Cristo' },
	},
	numberSymbols: {
		decimal: ',',
		group: '.',
		list: ';',
		percentSign: '%',
		plusSign: '+',
		minusSign: '-',
		exponential: 'E',
		superscriptingExponent: '×',
		perMille: '‰',
		infinite: '∞',
		nan: 'NaN',
		timeSeparator: ':',
		// currencyDecimal: undefined, // fallback to decimal
		// currencyGroup: undefined, // fallback to group
	},
};

export default class LocaleService {

	static getLocale() {
		const locale = window.locale || LocaleService.defaultLocale;
		const key = [...arguments].join('.');
		// console.log(key, locale[key]);
		return locale[key] || `{${key}}`;
	}

	static getObjectLocale() {
		// console.log([...arguments].join(','));
		let value;
		for (let i = 0; i < arguments.length; i++) {
			const key = arguments[i];
			value = value ? value[key] : locale[key];
		}
		return value;
	}

	static toLocaleString(locale, out = {}, ...args) {
		if (typeof locale === 'string') {
			out[args.join('.')] = locale;
		} else {
			Object.keys(locale).forEach(key => {
				const keys = args.slice();
				keys.push(key);
				out = this.toLocaleString(locale[key], out, ...keys);
			});
		}
		return out;
	}

	static toLocaleObject(locale, key, out = {}) {
		if (typeof locale === 'string') {
			out[key] = locale;
		} else {
			if (key) {
				out = out[key] = {};
			}
			Object.keys(locale).forEach(key => {
				out = this.toLocaleObject(locale[key], key, out);
			});
		}
		return out;
	}

}

LocaleService.defaultLocale = LocaleService.toLocaleString(locale_it);
