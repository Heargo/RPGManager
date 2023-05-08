import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-drop-down',
  templateUrl: './drop-down.component.html',
  styleUrls: ['./drop-down.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    multi: true,
    useExisting: forwardRef(() => DropDownComponent)
  }]
})
export class DropDownComponent implements ControlValueAccessor {

  @Input() options:any[] = [];
  @Input() defaultOption:any = null;
  @Input() selected:any = null;
  
  @Output() onChangeValue = new EventEmitter<string>();
  constructor() { }

  onChange = (value: string) => {};

  public newSelect(event: any): void {
    // STEP 5
    this.onChange(event.target.value);
    this.onChangeValue.emit(event.target.value);
  }

  // STEP 4
  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  writeValue(value:any) {
    this.selected=value;
  }
  registerOnTouched(){}

}
