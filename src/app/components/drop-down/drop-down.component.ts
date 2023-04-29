import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-drop-down',
  templateUrl: './drop-down.component.html',
  styleUrls: ['./drop-down.component.scss']
})
export class DropDownComponent {

  @Input() options:any[] = [];
  @Input() defaultOption:any = null;
  
  constructor() { }

}
