import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Game } from 'src/app/models/games';
import { ResponseType } from 'src/app/models/responses';
import { AuthentificationService } from 'src/app/services/auth.services';
import { GamesService } from 'src/app/services/games.services';
import { PlayersService } from 'src/app/services/players.services';
import { ToastService } from 'src/app/services/toast.services';

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
  
  constructor(private auth:AuthentificationService,
    public games:GamesService,private players:PlayersService,
    private router:Router,private toast:ToastService) { }
  

  isHost(){
    return this.auth.session?.$id === this.game.host;
  }
  
  GetImageUrlPreview(){
    if(this.game.image === this.games.DEFAULT_GAME_PREVIEW) return this.game.image;
    //if it's a blob url
    if(this.game.image.startsWith('blob:')) return this.game.image;
    else return this.games.GetImageUrlPreview(this.game.image);
  }

  async LeaveGame(){
    if(!this.interractable) return;
    let response = await this.games.LeaveGame(this.game);
    if(response.type === ResponseType.Success){
      this.removeGame.emit();
    }
  }

  async GetPlayers(){
    if(!this.interractable) return;
    
    await this.players.GetPlayers(this.game.id);
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
    
    this.toast.ShowLoading("Connecting to game");
    let player = await this.players.LoadPlayer(this.game.id);
    //if the user already has a player in this game or if he is the host (MJ, so no player) 
    if(player!==undefined || this.auth.GetUserID() === this.game.host){
      //console.log("user already has a player in this game");
      this.toast.HideLoading();
      this.router.navigate(['/game']);
    }else{
      this.games.ConnectToGame(this.game);
      this.toast.HideLoading();
      this.router.navigate(['/create-player']);
    }

    
  }

}
