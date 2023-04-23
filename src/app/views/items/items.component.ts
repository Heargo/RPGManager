import { Component } from '@angular/core';
import { Item, ItemRarity, ItemType } from 'src/app/models/items';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent {

  ItemRarityValues = Object.keys(ItemRarity);
  ItemTypesValues = Object.keys(ItemType);

  constructor() { }

  GetItems():Item[]{
    return [
      {id:'id1'},{id:"id2"},{id:"id3"}
    ]
  }
}
