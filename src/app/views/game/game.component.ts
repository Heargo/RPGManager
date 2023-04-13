import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GamesService } from 'src/app/services/games.services';
import { PlayersService } from 'src/app/services/players.services';
import { Game, Player } from 'src/app/models/games';
import { ToastService } from 'src/app/services/toast.services';
import { ResponseType } from 'src/app/models/responses';
import { Router } from '@angular/router';
import { AuthentificationService } from 'src/app/services/auth.services';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  


  playerList!:Player[];
  game!:Game|null;
  isMJ:boolean = false;
  userNotes!:string;
  constructor(private auth:AuthentificationService, private players:PlayersService,private games:GamesService,private toast:ToastService,private router:Router) {}

  async ngOnInit(){
    this.game = this.games.currentGame;
    if(this.game == null){
      this.toast.Show("No game selected",ResponseType.Error);
      this.router.navigate(['/games']);
    }else{
      this.playerList = await this.players.GetPlayers(this.game.id);
    }
    this.isMJ = this.games.IsUserHost();
    this.userNotes = "default notes";
  }

  onNotesChange(event:any){
    //TODO SAVE NOTES
    let content = event.target.value;
    console.log("notes changed: "+content);
  }

  

}
