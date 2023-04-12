export interface Game{
    id: string;
    name: string;
    description: string;
    image: string;
    host: string;
    teamID: string;
}

export interface GameAttribute{
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
    attributes: GameAttribute[];
}