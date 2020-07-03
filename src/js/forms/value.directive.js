import { Directive, getContext } from 'rxcomp';

export default class ValueDirective extends Directive {

	onChanges(changes) {
		const { node } = getContext(this);
		node.setAttribute('value', this.value);
	}

}

ValueDirective.meta = {
	selector: '[[value]]',
	inputs: ['value'],
};
