import { Component, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { GetItemRarityColor } from 'src/app/Utils/utils';
import { DEFAULT_ITEM, Item, ItemRarity, ItemType } from 'src/app/models/items';
import { GamesService } from 'src/app/services/games.services';
import { ItemsService } from 'src/app/services/items.services';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {

  ItemRarityValues = Object.keys(ItemRarity);
  ItemTypesValues = Object.keys(ItemType);
  loadedItems:Item[] = [];

  constructor(private items:ItemsService,private games:GamesService) { }

  async ngOnInit() {
    this.loadedItems = await this.GetItems();
    console.log("loaded items",this.loadedItems)
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

  GetRarityColor(rarity:ItemRarity):string{
    return GetItemRarityColor(rarity);
  }
}
