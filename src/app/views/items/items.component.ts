import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ContextMenu } from 'src/app/models/context-menu';
import { Item, ItemRarity, ItemType } from 'src/app/models/items';
import { ResponseType } from 'src/app/models/responses';
import { GamesService } from 'src/app/services/games.services';
import { ItemsService } from 'src/app/services/items.services';
import { PlayersService } from 'src/app/services/players.services';
import { ToastService } from 'src/app/services/toast.services';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {

  ItemRarityValues = Object.values(ItemRarity);
  ItemTypesValues = Object.values(ItemType);
  loadedItems:Item[] = [];
  searchResults:Item[] = [];
  selectedItem:Item|null = null;
  searchForm!:FormGroup;
  contextMenuToggle:boolean = false;
  contextMenu:ContextMenu[] = [];
  contextMenuStyle = {};

  constructor(private items:ItemsService,private games:GamesService,private router:Router,private formBuilder:FormBuilder,private players:PlayersService,private toast:ToastService) { }

  async ngOnInit() {
    this.searchForm = this.formBuilder.group({
      search: ['',[Validators.required,Validators.maxLength(99)]],
      rarity: [''],
      type: [''],
      minPrice: ['',Validators.min(0)],
      maxPrice: ['',Validators.min(0)],
    });

    if(!this.games.currentGame){
      this.router.navigate(["/games"]);
      return;
    }
    this.loadedItems = await this.GetItems();
    this.selectedItem = this.loadedItems[0];
    this.searchResults = [...this.loadedItems];

    this.contextMenu = await this.GenerateContextMenu();

    

    this.searchForm.valueChanges.subscribe((val) => {
      this.searchResults = this.FilterItems(val);
      this.selectedItem = this.searchResults[0];
    });
  }

  async GetItems():Promise<Item[]>{
    if (!this.games.currentGame) return [];
    let items = await this.items.LoadItems(this.games.currentGame);
    return items
  }

  GetImageUrl(item:Item):SafeUrl{
    let url = this.items.GetImageUrlPreview(item.imageID);
    return url
  }

  FilterItems(val:any):Item[]{
    //if there is a search term, filter by it
    let results = [...this.loadedItems];
    if(val.search!="")
      results = results.filter(i => 
        i.name.toLowerCase().includes(val.search.toLowerCase()) || i.description.toLowerCase().includes(val.search.toLowerCase())
      );

    if(this.ItemRarityValues.includes(val.rarity)){
      results = results.filter(i => i.rarity == val.rarity);    
      console.log("filtering by rarity",val.rarity)
    }

    if(this.ItemTypesValues.includes(val.type))
      results = results.filter(i => i.type == val.type);

    if(val.minPrice!="")
      results = results.filter(i => i.price >= val.minPrice);

    if(val.maxPrice!="") 
      results = results.filter(i => i.price <= val.maxPrice);

    return results;
  }

  async EditItem(item:Item){
    console.log("edit item",item.name);
  }

  async DeleteItem(item:Item){
    let response = await this.items.DeleteItem(item);
    if(response.type == ResponseType.Success){
      this.toast.Show("Item deleted successfully",ResponseType.Success);
      //remove item from loaded items & search results
      this.loadedItems = this.loadedItems.filter(i => i.id != item.id);
      this.searchResults = this.searchResults.filter(i => i.id != item.id);
      this.selectedItem = this.searchResults[0];
    }
    else{
      console.log(response.value)
      this.toast.Show("Failed to delete item",ResponseType.Error);
    }

  }

  async GiveItem(item:Item,playerID:string){
    if(!this.games.currentGame) return;

    console.log("give item to player",playerID);
    this.players.GiveItem(playerID,this.games.currentGame.teamID,item);

    
  }

  async GenerateContextMenu():Promise<ContextMenu[]>{
    let menu:ContextMenu[] = [];

    if(!this.games.currentGame) return menu;
    if (this.selectedItem == null) return menu;

    let playerList = await this.players.GetPlayers(this.games.currentGame.id);
    let playerMenu:ContextMenu[] = [];
    playerList.forEach(p => {
      playerMenu.push({name:p.name,func:()=>{this.GiveItem(this.selectedItem!,p.id)}});
    });
    menu.push({name:"Give to",subMenu:playerMenu});
    
    menu.push({name:"Edit (WIP)",func:()=>{this.EditItem(this.selectedItem!)}});
    menu.push({name:"Delete",func:()=>{this.DeleteItem(this.selectedItem!)}});

    return menu;
  }

  onToggleContextMenu(event:any){
    event.preventDefault() //this will disable default action of the context menu
    this.contextMenuToggle = !this.contextMenuToggle;

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

}
