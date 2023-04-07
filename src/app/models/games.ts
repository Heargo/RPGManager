export interface Game{
    id: string;
    name: string;
    description: string;
    image: string;
    host: string;
}

export interface GameAttribute{
    name: string;
    baseValue: number;
}