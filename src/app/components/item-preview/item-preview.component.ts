import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';
import { FormatMoney } from 'src/app/Utils/utils';
import { GameAttribute, MoneyFormat } from 'src/app/models/games';
import { DEFAULT_ITEM, Item, ItemRarity } from 'src/app/models/items';
import { ItemsService } from 'src/app/services/items.services';
import { PlayersService } from 'src/app/services/players.services';

@Component({
  selector: 'app-item-preview',
  templateUrl: './item-preview.component.html',
  styleUrls: ['./item-preview.component.scss']
})
export class ItemPreviewComponent {

    @Input() item:Item = DEFAULT_ITEM;

    constructor(private items:ItemsService,private sanitizer:DomSanitizer) { } 

    GetImageUrl():SafeUrl{
      let url = this.items.GetImageUrlPreview(this.item.imageID);
      return url
    }

    GetRarityStarsNumber():string[]{
      //return array until rarity
      let array = Object.values(ItemRarity);
      let slice = array.slice(0,array.indexOf(this.item.rarity)+1);
      return slice;
    }
    
    GetRarityColor():string{
      //get rarity color
      switch(this.item.rarity){
        case ItemRarity.Common:
          return "#AFBCBD";
        case ItemRarity.Uncommon:
          return "#7CD18F";
        case ItemRarity.Rare:
          return "#7CC8D1";
        case ItemRarity.Mythic:
          return "#BB7CD1";
        case ItemRarity.Legendary:
          return "#DFD366";
      }
    
    }

    PlayerMoney():SafeHtml{
      return this.sanitizer.bypassSecurityTrustHtml(FormatMoney(this.item.price,MoneyFormat.FantasyCoins));
    }

    GetPositiveAttributes():GameAttribute[]{
      let array = this.item.attributes.filter(x=>x.valueAddition>0);
      console.log("positive attributes",array)
      return array;
    }

    GetNegativeAttributes():GameAttribute[]{
      let array = this.item.attributes.filter(x=>x.valueAddition<0);
      console.log("negative attributes",array)
      return array;
    }

    GetSeparatorSize():number{
      //get max btw positive and negative attributes
      let pos = this.GetPositiveAttributes().length;
      let neg = this.GetNegativeAttributes().length;
      
      let max = Math.max(pos,neg);
      //add a .2 between each attribute
      return max + max*0.2;
    }


}
