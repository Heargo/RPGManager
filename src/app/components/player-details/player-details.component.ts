import { Component, Input, OnInit } from '@angular/core';
import { Player } from 'src/app/models/games';
import { PlayersService } from 'src/app/services/players.services';

@Component({
  selector: 'app-player-details',
  templateUrl: './player-details.component.html',
  styleUrls: ['./player-details.component.scss']
})
export class PlayerDetailsComponent implements OnInit {
  @Input() player!: Player|null;
  playerPortrait!:string;
  minimumInventory = [null,null,null,null,
                      null,null,null,null,
                      null,null,null,null,];

  constructor(private players:PlayersService) { }

  ngOnInit(): void {
    if(this.player != null)
      this.playerPortrait = this.players.GetImageUrlPreview(this.player.imageID);
  }

  
}
