import { GameAttribute } from "./games";

export interface Item{
    id:string,
    name:string,
    description:string,
    rarity:ItemRarity,
    type:ItemType,
    price:number,
    slot:ItemSlot,
    imageID:string,
    attributes:GameAttribute[]
}

export enum ItemRarity{
    Common = "Common",
    Uncommon = "Uncommon",
    Rare = "Rare",
    Mythic = "Mythic",
    Legendary = "Legendary"
}

export enum ItemType{
    Item = "Item",
    Consumable = "Consumable",
    Equipment = "Equipment"
}

export enum ItemSlot{
    None = "none",
    Head = "head",
    Chest = "chest",
    Legs = "legs",
    Foot = "foot",
    Hand = "hand",
    Ring = "ring",
    Earring = "earring",
    Necklace = "necklace",
    Weapon1 = "weapon1",
    Weapon2 = "weapon2"
}


export const DEFAULT_ITEM:Item = {
    id: "unique()",
    name: "New Item",
    description: "A new item",
    rarity: ItemRarity.Common,
    type: ItemType.Item,
    price: 0,
    slot: ItemSlot.None,
    imageID: "default",
    attributes: []
}


export function isValidItem(item:Item):boolean{
    //console.log("id",item.id != undefined,"name",item.name != undefined,"description",item.description != undefined,"rarity",item.rarity != undefined,"type",item.type != undefined,"price",item.price != undefined,"slot",item.slot != undefined,"imageID",item.imageID != undefined,"attributes",item.attributes != undefined)
    return item.id != undefined && 
        item.name != undefined && 
        item.description != undefined && 
        item.rarity != undefined && 
        item.type != undefined && 
        item.price != undefined && 
        item.slot != undefined && 
        item.imageID != undefined && 
        item.attributes != undefined;
}
