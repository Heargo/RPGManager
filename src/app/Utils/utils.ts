import { FormGroup } from "@angular/forms";
import { GameAttribute, MoneyFormat } from "../models/games";
import { ItemRarity } from "../models/items";
import { ID } from "appwrite";

export function getErrorMessage(error: unknown) {
    if (error instanceof Error) return error.message
    return String(error)
  }
  
export function scroll(el: HTMLElement) {
    el.scrollIntoView({behavior: 'smooth'});
}

export function passwordMatchValidator(g: FormGroup) {
  return g.get('password')?.value === g.get('passwordConfirm')?.value
     ? null : {'mismatch': true};
}

export function hasPermission(permissions: string[], id: string) {
  let hasPermission = false;

  permissions.forEach((permission) => {
    if (permission.includes(id)) {
      hasPermission = true;
    }
  });
  
  return hasPermission;
}

export function GetAttributeProgress(attribute:GameAttribute){
  if(attribute == undefined) return {display:"0/0",prct:0}

  let display = attribute.value + "/" + (attribute.baseValue + attribute.valueAddition)+" "+attribute.name.toUpperCase(); 
  
  //case where max is 0
  if((attribute.baseValue + attribute.valueAddition) ==0) return {display:display,prct:0}
  return {display:display,prct:attribute.value/(attribute.baseValue + attribute.valueAddition)*100 }
}


export function BytesToMegaBytes(bytes:number){
  return bytes/1000000;
}

export function FormatMoney(money:number,type:MoneyFormat):string{
  switch(type){
      case MoneyFormat.Dollars:
          return "$"+money;
      case MoneyFormat.Euros:
          return "€"+money;
      case MoneyFormat.Pounds:
          return "£"+money;
      case MoneyFormat.Yen:
          return "¥"+money;
      case MoneyFormat.Custom:
          return money+" TODO";
      case MoneyFormat.FantasyCoins:
          return GetFantasyCoinsFormat(money);
      default:
          return "$"+money;
  }

}

export function GetItemRarityColor(rarity:ItemRarity):string{
  //get rarity color
  switch(rarity){
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

function GetFantasyCoinsFormat(n:number):string{
  //1.1203 = 1gold 12silver 3copper
  let gold = Math.floor(n);
  let silver = Math.floor((n*100)%100);
  let copper = Math.floor((n*10000)%100);

  let str = "";
  //include the image as well to the string "<img src='assets/icons/money/{value}-coin.svg'  />"
  if(gold>0) str += gold+" <img src='assets/icons/money/gold-coin.svg'  /> ";
  if(silver>0 || gold>0) str += silver+" <img src='assets/icons/money/silver-coin.svg'  /> ";
  str += copper+" <img src='assets/icons/money/copper-coin.svg'  /> ";
  return str;
}

export function FormatAttributesForUpload(attributes:GameAttribute[]):any[]{
  return attributes.map((atr) => {
      return {
          $id:ID.unique(),
          name:atr.name,
          modifier:atr.valueAddition,
      }
  })
}

export function FormatAttributeForLoad(attributes:any[]):GameAttribute[]{
  if(attributes == undefined) return [];
  return attributes.map((atr) => {
      return {
          id:atr.$id,
          name:atr.name,
          valueAddition:atr.modifier,
          value:0,
          baseValue:0,
      }
  })
}