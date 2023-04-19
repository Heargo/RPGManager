import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from 'src/app/services/auth.services';
import { GamesService } from 'src/app/services/games.services';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {
  //isConnected = false;
  //use AuthentificationService to get the current user
  constructor(private authService:AuthentificationService,private games:GamesService) {  }

  isInGame():boolean{
    return this.games.currentGame != null;
  }

  isMJ():boolean{
    return this.games.IsUserHost();
  }

  isConnected():boolean{
    return this.authService.isConnected;
  }

  ExitGame(){
    this.games.currentGame = null;
  }
}
