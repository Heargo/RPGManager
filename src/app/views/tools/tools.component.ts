import { Component } from '@angular/core';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss']
})
export class ToolsComponent {
  constructor() { }

  onOpenNewTab(url: string) {
    window.open(url, '_blank');
  }
}
