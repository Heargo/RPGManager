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
    value: number; // value to add to the base value
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