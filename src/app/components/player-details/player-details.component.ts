import { Component, Input, OnInit } from '@angular/core';
import { toNumber } from '@vue/shared';
import { GameAttribute, Player } from 'src/app/models/games';
import { ResponseType } from 'src/app/models/responses';
import { GamesService } from 'src/app/services/games.services';
import { PlayersService } from 'src/app/services/players.services';
import { ToastService } from 'src/app/services/toast.services';

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

  constructor(private players:PlayersService,private games:GamesService,private toast:ToastService) { }

  ngOnInit(): void {
    if(this.player != null)
      this.playerPortrait = this.players.GetImageUrlPreview(this.player.imageID);
  }

  GetPlayerStatPoints():number{
    if(this.player == null) return 0;

    let baseAttributeValue =0;
    this.player.attributes.forEach(a => {
      if(a.baseValue)
        baseAttributeValue += a.baseValue;
    });

    return baseAttributeValue+ this.player.statPoints;
  }

  async onAttributeChange($event:any,atr:GameAttribute)
  {
    if(this.player == null) return;
    if(this.games.currentGame == null) return;

    //only allow numbers 
    if(isNaN(toNumber($event.target.value))){
      $event.target.value = atr.value;
      this.toast.Show("Only numbers allowed",ResponseType.Warning);
      return;
    }

    //dont go below the base value 
    let baseValue = this.games.currentGame.attributes.filter(a => a.name == atr.name)[0].baseValue;
    if($event.target.value < baseValue){
      $event.target.value = baseValue;
      this.toast.Show("Cannot go below base value",ResponseType.Warning);
    }

    //can't spend more stat points than available
    let totalStatPoints = this.GetPlayerStatPoints();
    let totalStatPointsUsed = 0;
    this.player.attributes.forEach(a => {
      if(a.name != atr.name)
        totalStatPointsUsed += a.value;
    });
    totalStatPointsUsed +=toNumber($event.target.value);
    console.log("totalStatPointsUsed: "+totalStatPointsUsed, "totalStatPoints: "+totalStatPoints);
    if(totalStatPointsUsed > totalStatPoints){
      $event.target.value = atr.value;
      this.toast.Show("Not enough stat points",ResponseType.Warning);
    }

    //be sure to only save the number value
    atr.value = toNumber($event.target.value);
    $event.target.value = atr.value;
    
    //update attribute 
    console.log("update attribute: ",atr.name,"id",atr.id," to value: "+atr.value);
    await this.players.UpdateAttribute(atr.id,{valueAddition:atr.value});

  }

  
}
