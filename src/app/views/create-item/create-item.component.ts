import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { GameAttribute } from 'src/app/models/games';
import { DEFAULT_ITEM, Item, ItemRarity, ItemSlot, ItemType, isValidItem } from 'src/app/models/items';
import { ResponseType } from 'src/app/models/responses';
import { GamesService } from 'src/app/services/games.services';
import { ToastService } from 'src/app/services/toast.services';

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.scss']
})
export class CreateItemComponent implements OnInit {

  item:Item = DEFAULT_ITEM;
  tabs:any = {'manual':true,'json':false};

  ItemRarityValues = Object.values(ItemRarity);
  ItemTypesValues = Object.values(ItemType);
  ItemSlotValues = Object.values(ItemSlot);
  GameAttributes:GameAttribute[];
  GameAttributesNames!:string[];
  currentCustomFile:File|null = null;

  itemImageUrl:SafeUrl = "assets/illustrations/default_item.jpg";
  itemForm!:FormGroup;

  itemJson = "";

  currentAttributeSelected="";
  currentModifierSelected="";

  constructor(private games:GamesService,private toast:ToastService,private formBuilder: FormBuilder,private sanitizer:DomSanitizer) {
    this.GameAttributes = this.games.currentGame!.attributes;
    //list of all attributes names in the current game
    this.GameAttributesNames = this.GameAttributes.map(a => a.name);
  }

  ngOnInit(): void {
    this.itemForm = this.formBuilder.group({
      name: [this.item.name,[Validators.required,Validators.maxLength(99)]],
      description: [this.item.description,[Validators.required,Validators.maxLength(1000)]],
      image: [this.item.imageID],
      price: [this.item.price,[Validators.required,Validators.min(0)]],
      rarity: [this.item.rarity,[Validators.required]],
      type: [this.item.type,[Validators.required]],
      slot: [this.item.slot,[Validators.required]],
    });
  }

  ToggleTab(tab:string){
    this.tabs.manual = false;
    this.tabs.json = false;
    this.tabs[tab] = true;
  }

  GetItemAsJson() {
    let item:any = {...this.itemForm.value};
    let attributes = this.item.attributes.map((attribute:any) => {
      return {
        name: attribute.name,
        modifier: attribute.valueAddition
      }
    });
    item.attributes = attributes;
    let val = JSON.stringify(item, null, 2);
    return val
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

    //change item.image to item.imageID
    item.imageID = item.image;
    delete item.image;

    //update item if of type Item
    if(isValidItem(item)){
      //update form
      this.itemForm.setValue({
        name: item.name,
        description: item.description,
        image: item.imageID,
        price: item.price,
        rarity: item.rarity,
        type: item.type,
        slot: item.slot,
      });
      this.itemJson = json;
      this.toast.Show("Changes applied successfully!",ResponseType.Success)
    }else{
      this.toast.Show("Invalid item properties",ResponseType.Error)
    }

  }

  onSelectAttribute(event:any){
    this.currentAttributeSelected = event;
  }

  onAddAttribute(){
    if(this.currentAttributeSelected == ""){return;}

    //modifier need to be a number different than 0
    let modifier = parseInt(this.currentModifierSelected);
    if(isNaN(modifier) || modifier == 0){
      this.toast.Show("Invalid modifier",ResponseType.Error);
      return;
    }

    //check if attribute already exists
    if(this.item.attributes.find(a => a.name == this.currentAttributeSelected)){
      this.toast.Show("Attribute already exists in item",ResponseType.Error);
      return;
    }

    let attribute = this.games.currentGame!.attributes.find(a => a.name == this.currentAttributeSelected);
    if(attribute == undefined){
      this.toast.Show("Attribute not found",ResponseType.Error);
    }
    else{
      let atr = {...attribute};
      atr.valueAddition = modifier;
      this.item.attributes.push(atr);
    }
  }

  onDeleteAttribute(attributeName:string){
    this.item.attributes = this.item.attributes.filter(a => a.name != attributeName);
  }

  onImageChange($event:any){
    //update image in label
    let file = $event.target.files[0];
    this.currentCustomFile = file;
    this.itemImageUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));

  }
}
