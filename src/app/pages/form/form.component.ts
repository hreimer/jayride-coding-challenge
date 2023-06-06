import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'jr-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {
  constructor(private formBuilder: FormBuilder) {}

  // set initial form state to not be submitted
  isSubmitted = false;
  channels: any = ['partner', 'agent', 'direct customer'];

  // creating a reactiveForm to validate if value is provided on each control
  requestForm: FormGroup = this.formBuilder.group({
    travellerName: [, { validators: [Validators.required], updateOn: "change" }],
    travellerEmail: [
        ,{validators: [Validators.required, Validators.email]
        ,updateOn: "change",}],
    channel: [, { validators: [Validators.required], updateOn: "change" }],
    meetGreetRequested: [false, { validators: [Validators.requiredTrue], updateOn: 'change' }],
    travelDateTime: [, { validators: [Validators.required], updateOn: "change" }],
    bookingPrice: [, { validators: [Validators.required], updateOn: "change" }],

  });

  // Access formcontrols getter
  get channel() {
    return this.requestForm.get('channel');
  }

  // convenience getter for easy access to form fields
  get form() { return this.requestForm.controls; }

  // this function is only needed to calidate the ng-select form control, if I had more time I would find a way to eliminate this, as all other fields throw validation errors when submitting the form, without calling this function
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
        const control = formGroup.get(field);
        if (control instanceof FormControl) {
            control.markAsTouched({onlySelf: true});
        } else if (control instanceof FormGroup) {
            this.validateAllFormFields(control);
        }
    });
  }


  sendRequest(): void {
    // see comment for this function
    this.validateAllFormFields(this.requestForm);
    this.isSubmitted = true;
    // do nothing if form is invalid (except the warnings that are shown and updated by the form error state)
    if (this.requestForm.invalid) {
      return;
    } else {
      // if no errors, print the values in console
      console.log(JSON.stringify(this.requestForm.value));
    }
  }

  // convenience function to test it
  resetForm() {
    this.isSubmitted = false;
    this.requestForm.reset();
}
}
