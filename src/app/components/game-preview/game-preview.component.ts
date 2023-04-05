import { Component, Input } from '@angular/core';
import { Game } from 'src/app/models/games';
import { AuthentificationService } from 'src/app/services/auth.services';

@Component({
  selector: 'app-game-preview',
  templateUrl: './game-preview.component.html',
  styleUrls: ['./game-preview.component.scss']
})
export class GamePreviewComponent {

  @Input() game!:Game;
  showOptions = false;
  
  constructor(private auth:AuthentificationService) { }
  

  isHost(){
    return this.auth.session?.$id === this.game.host;
  }

  async LeaveGame(){
    //TODO
  }

  async DeleteGame(){
    //TODO
  }

}
