import { Component } from '@angular/core';
import { scroll } from 'src/app/Utils/utils';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor() { }
  onScroll(el: string) {
    const domEl = document.getElementById(el);
    if(domEl){
      scroll(domEl);
    }
  } 
}
