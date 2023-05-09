import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormatMoney } from 'src/app/Utils/utils';
import { ContextMenu } from 'src/app/models/context-menu';
import { GameAttribute, MoneyFormat, Player } from 'src/app/models/games';
import { PlayerItem } from 'src/app/models/items';
import { ResponseType } from 'src/app/models/responses';
import { GamesService } from 'src/app/services/games.services';
import { PlayersService } from 'src/app/services/players.services';
import { ToastService } from 'src/app/services/toast.services';

@Component({
  selector: 'app-player-details',
  templateUrl: './player-details.component.html',
  styleUrls: ['./player-details.component.scss']
})
export class PlayerDetailsComponent implements OnInit, OnChanges {
  @Input() player!: Player|null;
  @Input() isMJ = true;
  playerPortrait!:string;
  minimumInventory: (PlayerItem|null)[] = [null,null,null,null,
                      null,null,null,null,
                      null,null,null,null,];

  contextMenuVisible = false;
  contextMenuStyle = {};
  contextMenu!:ContextMenu[];
  selectedItem:PlayerItem|null = null;

  constructor(private players:PlayersService,private games:GamesService,private toast:ToastService,private sanitizer:DomSanitizer) { }

  ngOnInit(): void {
    this.setup();
  }

  setup():void{
    if(this.player == null) return

    this.playerPortrait = this.players.GetImageUrlPreview(this.player.imageID);

    //reset inventory
    this.minimumInventory = [null,null,null,null,
      null,null,null,null,
      null,null,null,null,];

    //fill inventory
    this.player.inventory.forEach((item,index) => {
      this.minimumInventory[index] = item;
    });

    //setup context menu
    this.contextMenu = []
    this.contextMenu.push({name:"Sell",func:()=>{this.contextMenuVisible = false;this.SellItem();}});
  }

  ngOnChanges(): void {
    this.setup();
  }

  async SellItem(){
    if(this.player == null) return;
    if(this.games.currentGame == null) return;
    if(this.selectedItem == null) return;

    let deleteItem = await this.players.DeleteItemFromInventory(this.selectedItem.playerItemID);
    if(deleteItem.type == ResponseType.Success){ 
      let money = this.player.money + this.selectedItem.price
      this.players.UpdatePlayer(this.player.id,{money:money});
      this.toast.Show("Item sold for "+FormatMoney(this.selectedItem.price,MoneyFormat.FantasyCoins),ResponseType.Success);
    }
    else{
      this.toast.Show("Failed to sell item",ResponseType.Error);
    }
  }

  onToggleContextMenu(event:any,item:PlayerItem|null){
    if(item == null) return;

    this.selectedItem = item;
    event.preventDefault() //this will disable default action of the context menu
    this.contextMenuVisible = !this.contextMenuVisible;

    let mousepos = {
      x: event.clientX + window.scrollX,
      y: event.clientY + window.scrollY
    }


    this.contextMenuStyle = {
      "position":"absolute",
      "left":mousepos.x + "px",
      "top":mousepos.y + "px"
    }
  }




  GetAvailablePlayerStatPoints():number{
    if(this.player == null) return 0;

    let pointsSpent =0;
    this.player.attributes.forEach(a => {
      if(a.valueAddition)
        pointsSpent += a.valueAddition;
    });

    //max minus current in use
    return this.player.statPoints - pointsSpent;
  }


  async AddStatPoint(input:HTMLInputElement){
    if(this.player == null) return;
    if(isNaN(Number(input.value))) return;
    
    await this.players.UpdatePlayer(this.player.id,{statPoints:this.player.statPoints+Number(input.value)});
    input.value = "";

  }

  async onAttributeChange($event:any,atr:GameAttribute)
  {
    if(this.player == null) return;
    if(this.games.currentGame == null) return;

    //if empty, set to 0
    if($event.target.value == "") $event.target.value = 0;

    //only allow numbers 
    if(isNaN(Number($event.target.value))){
      $event.target.value = atr.baseValue+atr.valueAddition;
      this.toast.Show("Only numbers allowed",ResponseType.Warning);
      return;
    }

    //dont go below the base value 
    if($event.target.value < atr.baseValue){
      $event.target.value = atr.baseValue+atr.valueAddition;
      this.toast.Show("Cannot go below base value",ResponseType.Warning);
      return
    }

    //can't spend more stat points than available
    let totalStatPointsUsed = 0;
    this.player.attributes.forEach(a => {
      if(a.name != atr.name){
        totalStatPointsUsed += a.valueAddition;
      }
    });
    totalStatPointsUsed +=Number($event.target.value) - atr.baseValue;
    if(totalStatPointsUsed > this.player.statPoints){
      $event.target.value = atr.baseValue+atr.valueAddition;
      this.toast.Show("Not enough stat points",ResponseType.Warning);
      return
    }

    
    
    //update attribute 
    let valueAddition = Number($event.target.value) - atr.baseValue;    
    await this.players.UpdateAttribute(atr.id,{valueAddition:valueAddition});
   


  }

  PlayerMoney():SafeHtml{
    if(this.player == null) return "0";
    return this.sanitizer.bypassSecurityTrustHtml(FormatMoney(this.player.money,MoneyFormat.FantasyCoins));
  }

  GenerateContextMenu()
  {

  }

  
}
