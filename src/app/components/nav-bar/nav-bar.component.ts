import { Component } from '@angular/core';
import { AuthentificationService } from 'src/app/services/auth.services';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {
  isMJ = false;
  isInGame = false;
  //isConnected = false;
  //use AuthentificationService to get the current user
  constructor(private authService:AuthentificationService) {  }

  isConnected():boolean{
    return this.authService.isConnected;
  }
}
