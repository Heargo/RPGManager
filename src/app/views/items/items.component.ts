import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Item, ItemRarity, ItemType } from 'src/app/models/items';
import { GamesService } from 'src/app/services/games.services';
import { ItemsService } from 'src/app/services/items.services';

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

  constructor(private items:ItemsService,private games:GamesService,private router:Router,private formBuilder:FormBuilder) { }

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
}
