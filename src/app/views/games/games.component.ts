import { Component, OnInit } from '@angular/core';
import { GamesService } from 'src/app/services/games.services';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {
  constructor(private games:GamesService) {}

  ngOnInit(){
    this.games.LoadGames();
  }
}
