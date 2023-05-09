import { Component, Input } from '@angular/core';
import { ContextMenu } from 'src/app/models/context-menu';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent {
  

  @Input() menu!: ContextMenu[];
  enableSubMenu:string = "";

  constructor() { }

  onExecuteFunction(menuItem: ContextMenu){
    if(menuItem.func)
      menuItem.func();
  }

  onEnableSubMenu(menuItem: ContextMenu){
    this.enableSubMenu = menuItem.name;
  }
}
