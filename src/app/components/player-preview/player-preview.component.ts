import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { GameAttribute, Player } from 'src/app/models/games';
import { PlayersService } from 'src/app/services/players.services';
import { GetAttributeProgress } from 'src/app/Utils/utils';

@Component({
  selector: 'app-player-preview',
  templateUrl: './player-preview.component.html',
  styleUrls: ['./player-preview.component.scss']
})
export class PlayerPreviewComponent implements OnInit, OnChanges {

  @Input() player!: Player;
  lifeAttribute:GameAttribute = {id:"",name:"",value:0,baseValue:0,valueAddition:0};
  manaAttribute:GameAttribute = {id:"",name:"",value:0,baseValue:0,valueAddition:0};
  constructor(private players:PlayersService) { 
  }

  ngOnInit(): void {
    this.lifeAttribute = this.GetAttribute("Life");
    this.manaAttribute = this.GetAttribute("Mana");
  }

  ngOnChanges(): void {
    this.lifeAttribute = this.GetAttribute("Life");
    this.manaAttribute = this.GetAttribute("Mana");
  }

  GetPlayerImage():string{
    let urlPreview =this.players.GetImageUrlPreview(this.player.imageID);
    return urlPreview
  }

  GetAttribute(atr:string):GameAttribute{
    return this.player.attributes.find(x=>x.name==atr)!;
  }
  
  AttributeProgress(attribute:GameAttribute){
    return GetAttributeProgress(attribute);
  }
}
