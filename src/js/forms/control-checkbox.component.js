import ControlComponent from './control.component';

export default class ControlCheckboxComponent extends ControlComponent {

	onInit() {
		this.label = this.label || 'label';
	}

}

ControlCheckboxComponent.meta = {
	selector: '[control-checkbox]',
	inputs: ['control', 'label', 'name'],
	template: /* html */ `
		<div class="group--form--checkbox" [class]="{ required: control.validators.length }">
			<label>
				<input type="checkbox" class="control--checkbox" [formControl]="control" [value]="true" [formControlName]="name" />
				<span [innerHTML]="label | html"></span>
			</label>
			<span *if="control.validators.length" class="required__badge">required</span>
		</div>
		<errors-component *if="control.validators.length" [control]="control"></errors-component>
	`
};
