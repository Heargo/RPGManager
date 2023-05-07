import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BytesToMegaBytes } from 'src/app/Utils/utils';
import { GameAttribute } from 'src/app/models/games';
import { DEFAULT_ITEM, Item, ItemRarity, ItemSlot, ItemType, isValidItem } from 'src/app/models/items';
import { Response, ResponseType } from 'src/app/models/responses';
import { GamesService } from 'src/app/services/games.services';
import { ItemsService } from 'src/app/services/items.services';
import { ToastService } from 'src/app/services/toast.services';

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.scss']
})
export class CreateItemComponent implements OnInit {

  item:Item = {...DEFAULT_ITEM};
  tabs:any = {'manual':true,'json':false,'ai':false};

  ItemRarityValues = Object.values(ItemRarity);
  ItemTypesValues = Object.values(ItemType);
  ItemSlotValues = Object.values(ItemSlot);
  GameAttributes!:GameAttribute[];
  GameAttributesNames!:string[];
  currentCustomFile:File|null = null;

  itemImageUrl:SafeUrl = "assets/illustrations/default_item.jpg";
  itemForm!:FormGroup;

  itemJson = "";

  currentAttributeSelected="";
  currentModifierSelected="";

  constructor(private games:GamesService,private toast:ToastService,private formBuilder: FormBuilder,private sanitizer:DomSanitizer, private items:ItemsService,private router:Router) {

    if(!this.games.currentGame){
      this.router.navigate(["/games"]);
      return;
    }
    
    this.GameAttributes = this.games.currentGame!.attributes;
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

    this.itemForm.valueChanges.subscribe((val) => {
      this.UpdateItem(val);
    });
  }

  UpdateItem(val:any){
    //update item 
    if(val.name)
      this.item.name = val.name;
    if(val.description)
      this.item.description = val.description;
    if(val.imageID)
      this.item.imageID = val.imageID;
    if(val.price)
      this.item.price = val.price;
    if(val.rarity)
      this.item.rarity = val.rarity;
    if(val.type)
      this.item.type = val.type;
    if(val.slot)
      this.item.slot = val.slot;
  }

  ToggleTab(tab:string){
    Object.keys(this.tabs).forEach((key) => {
      this.tabs[key] = false;
    });
    this.tabs[tab] = true;
  }

  GetItemAsJson(itemToConvert:any,debug=false) {
    if(debug) console.log("itemToConvert",itemToConvert)
    let item:any = {...itemToConvert};
    let attributes = this.item.attributes.map((attribute:any) => {
      return {
        name: attribute.name,
        modifier: attribute.valueAddition //this is done to make the json more readable for user
      }
    });
    //remove image,imageID and id from json (for user experience, since it's not possible to upload an image from json)
    delete item.image;
    delete item.imageID;
    delete item.id;
    
    item.attributes = attributes;
    let val = JSON.stringify(item, null, 2);
    if(debug) console.log("val",val)
    return val
  }

  onUpdateItemFromJson(event:any) {
    let json = event.target.value;
    //get json
    let item:any = JSON.parse(json);
    //add id to attributes
    let invalidsAtr:any=[]
    item.attributes.forEach((attribute:any) => {
      //console.log("looking for attribute id",attribute.name,this.item.attributes.find((a:any) => a.name == attribute.name));
      let atr = this.GameAttributes.find((a:any) => a.name == attribute.name);
      if(atr != undefined) {
        attribute.id = atr.id
        //update valueAddition with modifier value (because valueAddition is used in the form but modifier is used in the json for user)
        attribute.valueAddition = attribute.modifier;
      }else{
        invalidsAtr.push(attribute);
      }
    });

    if(invalidsAtr.length > 0){
      this.toast.Show("Invalid attributes: "+invalidsAtr.map((a:any) => a.name).join(", "),ResponseType.Error)
      return;
    }
    //add id to item
    item.id = this.item.id;

    //udpate item.imageID
    item.imageID = this.itemImageUrl;

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
      //update item
      this.item = item;
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
    //update image in item
    this.UpdateItem({imageID:this.itemImageUrl});

  }

  GeneratePromptForItemCreation(){
    //get list of all attributes
    let attributes = this.games.currentGame!.attributes.map(a => a.name);
    //get list of all rarities
    let rarities = Object.values(ItemRarity);
    //get list of all types
    let types = Object.values(ItemType);
    //get list of all slots
    let slots = Object.values(ItemSlot);

    let prompt = "I want you to act as a json generator and prompt expert. You will reply ONLY with the json then the prompt to generate the image needed. You will be asked to provide the following information That are coherent:\n\n";
    prompt += "name: The name of the item\n";
    prompt += "description: The description of the item\n";
    prompt += "price: The price of the item. The price is a float number. ex: 1.2546 = 1 gold coin, 25 silver coin, 46 copper coins\n";
    prompt += "rarity: The rarity of the item. here are the ONLY possible values: ["+rarities+"]\n";
    prompt += "type: The type of the item. here are the ONLY possible values: ["+types+"]\n";
    prompt += "slot: The slot of the item. Slot is none if the item is not a equipment type. here are the ONLY possible values: ["+slots+"]\n";
    prompt += "attributes: The attributes of the item. here are the ONLY possible attributes names: ["+attributes+"]\n\n";
    prompt += "Each attribute as the following format : {name: \"attributeName\", modifier: 1}\n";
    prompt += "The modifier is a number that will be added to the player attributes. ex: {name: \"strength\", modifier: 1} will add 1 to the strength attribute of the character. Modifier can be negative\n\n";
    prompt += "here is a json example:\n\n";
    prompt += this.GetItemAsJson(DEFAULT_ITEM,true);
    prompt += "\n\n";
    prompt += "The informations generated must be interesting. Try to create interesting name and descriptions as well as coherents attributes. If attributes are not necessary you can have a empty list\n";
    prompt += "Based on the informations you provided, I will generate an image for the item. You will use you Midjourney and other AI tools expertise to provide me a complete prompt that I can used to help me as well.\n\n"
    prompt += "Start by asking by what I have in mind. You will need to generate the correct json and prompt based on my needs. Please only reply with the json and prompt\n";
    
    return prompt;
  
  }

  onCopyPrompt(){
    let prompt =this.GeneratePromptForItemCreation();

    //copy to clipboard
    navigator.clipboard.writeText(prompt).then(() => {
      this.toast.Show("Copied to clipboard!",ResponseType.Success);
    }
    ).catch(() => {
      this.toast.Show("Failed to copy to clipboard",ResponseType.Error);
    }
    );
  }


  async onCreateItem(){
    if(this.games.currentGame == undefined){return;}
    //if image is bigger than 2mb
    if(this.currentCustomFile != undefined && BytesToMegaBytes(this.currentCustomFile.size) >2){
      this.toast.Show("Image is too big. Max size is 2mb",ResponseType.Warning);
      return;
    }
    
    let response:Response = await this.items.CreateItem(this.item,this.currentCustomFile,this.games.currentGame);

    if(response.type == ResponseType.Success){
      this.router.navigate(["/items"]);
    }
  }
}
