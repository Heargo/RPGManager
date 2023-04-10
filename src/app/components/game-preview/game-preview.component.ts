import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Game } from 'src/app/models/games';
import { ResponseType } from 'src/app/models/responses';
import { AuthentificationService } from 'src/app/services/auth.services';
import { GamesService } from 'src/app/services/games.services';

@Component({
  selector: 'app-game-preview',
  templateUrl: './game-preview.component.html',
  styleUrls: ['./game-preview.component.scss']
})
export class GamePreviewComponent {

  @Input() game!:Game;
  @Input() interractable = true;
  @Input() bigPreview = false;

  @Output() removeGame = new EventEmitter();

  showOptions = false;
  
  constructor(private auth:AuthentificationService,public games:GamesService) { }
  

  isHost(){
    return this.auth.session?.$id === this.game.host;
  }
  
  GetImageUrlPreview(){
    if(this.game.image === 'assets/illustrations/default_icon.jpg') return this.game.image;
    //if it's a blob url
    if(this.game.image.startsWith('blob:')) return this.game.image;
    else return this.games.GetImageUrlPreview(this.game.image);
  }

  async LeaveGame(){
    if(!this.interractable) return;
    //TODO
  }

  async DeleteGame(){
    if(!this.interractable) return;
    let response = await this.games.DeleteGame(this.game);
    if(response.type === ResponseType.Success){
      this.removeGame.emit();
    }
  }

  async ConnectToGame(){
    if(!this.interractable) return;
    //TODO
  }

}
