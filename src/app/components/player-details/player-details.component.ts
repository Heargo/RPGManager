import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormatMoney } from 'src/app/Utils/utils';
import { ContextMenu } from 'src/app/models/context-menu';
import { GameAttribute, MoneyFormat, Player } from 'src/app/models/games';
import { Item, ItemSlot, ItemType } from 'src/app/models/items';
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

  //without the first value (none)
  equippedSlots = Object.values(ItemSlot).slice(1); 

  contextMenuVisible = false;
  contextMenuStyle = {};
  previewMenuStyle = {};
  contextMenu:ContextMenu[] = [];
  selectedItem:PlayerItem|null = null;
  viewItemPreview = false;

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

  }


  viewItem(item:PlayerItem|null){
      this.selectedItem = item;
      this.viewItemPreview = item!=null;
  }

  ngOnChanges(): void {
    this.setup();
  }

  GenerateContextMenu(){
    if(this.selectedItem == null) return;
    this.contextMenu = [];

    this.contextMenu.push({name:"View details",func:()=>{this.contextMenuVisible = false;this.viewItem(this.selectedItem);}});

    //if item is equiment
    if(this.selectedItem.type == ItemType.Equipment && this.selectedItem.equipped == false)
      this.contextMenu.push({name:"Equip",func:()=>{this.contextMenuVisible = false;this.EquipItem();}});
    if(this.selectedItem.equipped == true)
      this.contextMenu.push({name:"Unequip",func:()=>{this.contextMenuVisible = false;this.UnequipItem();}});

    //if item is consumable
    if(this.selectedItem.type == ItemType.Consumable)
      this.contextMenu.push({name:"Use",func:()=>{this.contextMenuVisible = false;this.UseItem();}});
    
    this.contextMenu.push({name:"Sell",func:()=>{this.contextMenuVisible = false;this.SellItem();}});
  }

  getInventory():(PlayerItem|null)[]{
    if(this.player == null) return this.minimumInventory;
    //reset inventory
    this.minimumInventory = [null,null,null,null,
      null,null,null,null,
      null,null,null,null,];
    //fill inventory
    this.player.inventory.forEach((item) => {
      if(!item.equipped){
        this.minimumInventory[item.inventorySlotPosition] = item;
      };
    });

    return this.minimumInventory;
  }

  async RefreshPlayer(){
    if(this.player == null) return;
    await this.players.UpdatePlayer(this.player.id,{money:this.player.money}); // to refresh the player in realtime
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

  async EquipItem(){
    if(this.player == null) return;
    if(this.selectedItem == null) return;

    this.selectedItem.equipped = !this.selectedItem.equipped;
    let response = await this.players.ToggleEquipementItem(this.selectedItem,true);
    if(response.type == ResponseType.Success){
      await this.RefreshPlayer()
      this.toast.Show("Item equipped",ResponseType.Success);
    }
    console.log("Equip item");
  }

  async UnequipItem(){
    if(this.player == null) return;
    if(this.selectedItem == null) return;

    this.selectedItem.equipped = !this.selectedItem.equipped;
    //find the first empty slot
    let slot=0;
    for(let i = 0; i < this.minimumInventory.length; i++){
      if(this.minimumInventory[i] == null){
        this.selectedItem.inventorySlotPosition = slot;
        console.log("found empty slot at",slot)
        break;
      }
      slot++;
    }
    let response = await this.players.ToggleEquipementItem(this.selectedItem,false);
    if(response.type == ResponseType.Success){
      await this.RefreshPlayer()
      this.toast.Show("Item unequipped",ResponseType.Success);
    }
    else{
      console.log(response.value);
      this.toast.Show("Failed to unequip item",ResponseType.Error);
    }

  }

  async UseItem(){
    if(this.player == null) return;
    if(this.selectedItem == null) return;

    let response = await this.players.UseItem(this.player,this.selectedItem);
    if(response.type == ResponseType.Success){
      console.log("let's now delete the item",this.selectedItem.playerItemID)
      await this.players.DeleteItemFromInventory(this.selectedItem.playerItemID);
      await this.RefreshPlayer()
      this.toast.Show("Item used",ResponseType.Success);
    }
    else{
      console.log(response.value);
      this.toast.Show("Failed to use item",ResponseType.Error);
    }
  }

  getEquippedItems():(PlayerItem|string)[]{
    let items: (PlayerItem|string)[] = [];
    
    //for each slot, find the item that is equipped
    this.equippedSlots.forEach((slot) => {
      let item = this.player?.inventory.find(i => (i.slot == slot) && (i.equipped == true));
      if(item != undefined){
        items.push(item);
      }else{
        items.push(slot);
      }
    });
    
    return items;
  }

  isItemEquipped(slot:PlayerItem|string):boolean{
    return (typeof slot != "string");
  }


  onToggleContextMenu(event:any,item:PlayerItem|null|string){
    if(item == null || typeof item =='string') return;

    this.selectedItem = item;
    this.GenerateContextMenu();
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
  
}
