import { Component, Input, input, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss'
})
export class TextInputComponent implements ControlValueAccessor{
  label = input<string>('');
  type = input<string>('text');
  id = input<string>('');
  @Input() submitted = false;

  constructor(@Self() public ngControl: NgControl) {
    ngControl.valueAccessor = this;
  }

  writeValue(obj: any): void {
   
  }
  registerOnChange(fn: any): void {
   
  }
  registerOnTouched(fn: any): void {
   
  }

  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }
}
