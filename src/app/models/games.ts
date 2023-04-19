export interface Game{
    id: string;
    name: string;
    description: string;
    image: string;
    host: string;
    teamID: string;
    attributes: GameAttribute[];
    baseStatPoints: number;
    baseMoney: number;
}

export interface GameAttribute{
    id: string;
    name: string;
    baseValue: number;
    valueAddition: number; // value to add to the base value, both make the max value
    value: number; // the current value of the attribute (max value = baseValue + valueAddition)
}

export interface Player{
    id: string;
    gameID: string;
    ownerID: string;
    imageID: string;
    name: string;
    money: number;
    statPoints: number;
    attributes: GameAttribute[];
}

export enum MoneyFormat{
    FantasyCoins = 0,
    Dollars = 1,
    Euros = 2,
    Pounds = 3,
    Yen = 4,
    Custom = 5,
}