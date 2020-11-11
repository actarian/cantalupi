import ControlComponent from './control.component';

export default class ControlTextComponent extends ControlComponent {

	onInit() {
		this.label = 'label';
		this.required = false;
	}

}

ControlTextComponent.meta = {
	selector: '[control-text]',
	inputs: ['control', 'label', 'name'],
	template: /* html */ `
		<div class="group--form" [class]="{ required: control.validators.length }">
			<label [innerHTML]="label"></label>
			<input type="text" class="control--text" [formControl]="control" [placeholder]="label" [formControlName]="name" />
			<span class="required__badge">required</span>
		</div>
		<errors-component [control]="control"></errors-component>
	`
};
