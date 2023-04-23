export interface Item{
    id:string,
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