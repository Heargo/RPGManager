import { Component } from '@angular/core';
import { DEFAULT_ITEM, Item, ItemRarity, ItemType, isValidItem } from 'src/app/models/items';
import { ResponseType } from 'src/app/models/responses';
import { GamesService } from 'src/app/services/games.services';
import { ToastService } from 'src/app/services/toast.services';

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.scss']
})
export class CreateItemComponent {

  item:Item = DEFAULT_ITEM;
  tabs:any = {'manual':true,'json':false};

  ItemRarityValues = Object.keys(ItemRarity);
  ItemTypesValues = Object.keys(ItemType);

  constructor(private games:GamesService,private toast:ToastService) {

    //this.item.attributes = this.games.currentGame!.attributes;
  }

  ToggleTab(tab:string){
    this.tabs.manual = false;
    this.tabs.json = false;
    this.tabs[tab] = true;
  }
  GetItemAsJson() {
    //get json without id 
    let item:any = {...this.item};
    delete item.id;
    //delete id in attributes
    item.attributes.forEach((attribute:any) => {
      delete attribute.id;
    });

    return JSON.stringify(item, null, 2);
  }

  onUpdateItemFromJson(event:any) {
    let json = event.target.value;
    //get json
    let item:any = JSON.parse(json);
    //add id to attributes
    item.attributes.forEach((attribute:any) => {
      attribute.id = this.item.attributes.find((a:any) => a.name == attribute.name)!.id;
    });
    //add id to item
    item.id = this.item.id;

    //update item if of type Item
    if(isValidItem(item)){
      this.item = item;
      this.toast.Show("Changes applied successfully!",ResponseType.Success)
    }else{
      this.toast.Show("Invalid item properties",ResponseType.Error)
    }

  }

  onSelectItemType(event:any){
    this.item.type = event.target.value;
  }

  onSelectItemRarity(event:any){
    this.item.rarity = event.target.value;
  }
}
