import { Component, Input, OnInit } from '@angular/core';
import { GameAttribute, Player } from 'src/app/models/games';
import { PlayersService } from 'src/app/services/players.services';

@Component({
  selector: 'app-player-preview',
  templateUrl: './player-preview.component.html',
  styleUrls: ['./player-preview.component.scss']
})
export class PlayerPreviewComponent implements OnInit {

  @Input() player!: Player;
  lifeAttribute:GameAttribute = {id:"",name:"",value:0,baseValue:0,valueAddition:0};
  manaAttribute:GameAttribute = {id:"",name:"",value:0,baseValue:0,valueAddition:0};
  constructor(private players:PlayersService) { 
  }

  ngOnInit(): void {
    console.log(this.player)
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

  GetAttributeProgress(attribute:GameAttribute){
    if(attribute == undefined) return {display:"0/0",prct:0}

    let display = attribute.value + "/" + (attribute.baseValue + attribute.valueAddition)+" "+attribute.name.toUpperCase(); 
    
    //case where max is 0
    if((attribute.baseValue + attribute.valueAddition) ==0) return {display:display,prct:0}
    
    return {display:display,prct:attribute.value/(attribute.baseValue + attribute.valueAddition)*100 }
  }
  
}
