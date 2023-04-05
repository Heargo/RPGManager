import { Component, OnInit } from '@angular/core';
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
  
  constructor(private games:GamesService) {}
  
  async ngOnInit(){
    this.userGames =  await this.games.LoadGames();
  }

  onJoinGame(){

    if(this.showIdInput){
      //join game

      //if success, hide input
      this.showIdInput = false;
    }else{
      this.showIdInput = true;
    }
  }


}
