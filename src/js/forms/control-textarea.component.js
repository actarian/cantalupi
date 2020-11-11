import ControlComponent from './control.component';

export default class ControlTextareaComponent extends ControlComponent {

	onInit() {
		this.label = 'label';
		this.required = false;
	}

}

ControlTextareaComponent.meta = {
	selector: '[control-textarea]',
	inputs: ['control', 'label', 'name'],
	template: /* html */ `
		<div class="group--form--textarea" [class]="{ required: control.validators.length }">
			<label [innerHTML]="label"></label>
			<textarea class="control--text" [formControl]="control" [innerHTML]="label" rows="4" [formControlName]="name"></textarea>
			<span class="required__badge">required</span>
		</div>
		<errors-component [control]="control"></errors-component>
	`
};
