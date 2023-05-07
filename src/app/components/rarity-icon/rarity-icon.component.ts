import { Component, Input } from '@angular/core';
import { GetItemRarityColor } from 'src/app/Utils/utils';
import { ItemRarity } from 'src/app/models/items';

@Component({
  selector: 'app-rarity-icon',
  templateUrl: './rarity-icon.component.html',
  styleUrls: ['./rarity-icon.component.scss']
})
export class RarityIconComponent {

  @Input() rarity!:ItemRarity;

  constructor() { }

  GetRarityStarsNumber():string[]{
    //return array until rarity
    let array = Object.values(ItemRarity);
    let slice = array.slice(0,array.indexOf(this.rarity)+1);
    return slice;
  }
  
  GetRarityColor():string{
    return GetItemRarityColor(this.rarity);
  
  }
}
