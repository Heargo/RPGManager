import { Component, Input } from '@angular/core';
import { GameAttribute, Player } from 'src/app/models/games';
import { PlayersService } from 'src/app/services/players.services';

@Component({
  selector: 'app-player-preview',
  templateUrl: './player-preview.component.html',
  styleUrls: ['./player-preview.component.scss']
})
export class PlayerPreviewComponent {

  @Input() player!: Player;
  constructor(private players:PlayersService) { 
  }

  GetPlayerImage():string{
    let urlPreview =this.players.GetImageUrlPreview(this.player.imageID);
    return urlPreview
  }

  GetAttribute(atr:string):GameAttribute{
    return this.player.attributes.find(x=>x.name==atr)!;
  }

  GetAttributeProgress(atr:string){
    let attribute = this.GetAttribute(atr);

    let display = attribute.value + "/" + (attribute.baseValue + attribute.valueAddition)+" "+attribute.name.toUpperCase(); 
    return {display:display,prct:attribute.value/(attribute.baseValue + attribute.valueAddition)*100 }
  }
  
}
