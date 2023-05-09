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

export interface PlayerItem extends Item{
    playerItemID:string,
    playerID:string,
    equiped:boolean,
    inventorySlotPosition:number
}

export enum ItemRarity{
    Common = "common",
    Uncommon = "uncommon",
    Rare = "rare",
    Mythic = "mythic",
    Legendary = "legendary"
}

export enum ItemType{
    Item = "item",
    Consumable = "consumable",
    Equipment = "equipment"
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
    imageID: "assets/illustrations/default_item.jpg",
    attributes: []
}


export function isValidItem(item:Item):boolean{
    console.log("id",item.id != undefined,"name",item.name != undefined,"description",item.description != undefined,"rarity",item.rarity != undefined,"type",item.type != undefined,"price",item.price != undefined,"slot",item.slot != undefined,"imageID",item.imageID != undefined,"attributes",item.attributes != undefined)
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
