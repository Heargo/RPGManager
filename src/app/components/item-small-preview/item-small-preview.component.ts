import { Component, Input } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { DEFAULT_ITEM, Item } from 'src/app/models/items';
import { ItemsService } from 'src/app/services/items.services';


@Component({
  selector: 'app-item-small-preview',
  templateUrl: './item-small-preview.component.html',
  styleUrls: ['./item-small-preview.component.scss']
})
export class ItemSmallPreviewComponent {
  
  @Input() item!:any;

  constructor(private items:ItemsService) { 

    if(typeof this.item == "string"){
      this.item = DEFAULT_ITEM;
    }

  }

  GetImageUrl(item:Item):SafeUrl{
    let url = this.items.GetImageUrlPreview(item.imageID);
    return url
  }


}

