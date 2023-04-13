import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Game } from 'src/app/models/games';
import { GamesService } from 'src/app/services/games.services';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {

  userGames:Game[] = [];
  showIdInput = false;
  teamID:string = '';
  
  constructor(private games:GamesService,private router:Router) {}
  
  async ngOnInit(){
    this.userGames =  await this.games.LoadGames();
  }

  onRemoveGame(game:Game){
    this.userGames = this.userGames.filter((g:Game) => g.id !== game.id);
  }

  onCreateGame(){
    this.router.navigate(['/new-game']);
  }

  async onJoinGame(){

    if(this.showIdInput){
      //join game
      console.log(this.teamID)
      let response = await this.games.JoinGame(this.teamID);
      console.log(response);
      //if success, hide input and reload games
      console.log("reload games")
      this.userGames =  await this.games.LoadGames();
      this.showIdInput = false;
    }else{
      this.showIdInput = true;
    }
  }


}
