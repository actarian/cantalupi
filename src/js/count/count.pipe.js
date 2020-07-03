import { Pipe } from "rxcomp";

export default class CountPipe extends Pipe {

	static isNumber(value) {
		return typeof value === 'number' && isFinite(value);
	}

	static transform(value) {
		if (!CountPipe.isNumber(value)) {
			return value;
		}
		value = parseInt(value);
		let count = '';
		if (value > 1000000) {
			value = Math.floor(value / 100000) / 10;
			count = value + 'M';
		} else if (value > 1000) {
			value = Math.floor(value / 100) / 10;
			count = value + 'k';
		} else {
			return value;
		}
		return count;
	}

}

CountPipe.meta = {
	name: 'count',
};
