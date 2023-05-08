import { Injectable } from '@angular/core';
import { Client, Databases, Functions, ID, Permission, Query, Role, Storage, Teams} from "appwrite";
import { environment } from 'src/environments/environment';
import { FormatAttributeForLoad, getErrorMessage } from '../Utils/utils';
import { ResponseType, Response } from '../models/responses';
import { AuthentificationService } from './auth.services';
import { Game, GameAttribute, MoneyFormat, Player } from '../models/games';
import { ToastService } from './toast.services';
import { Item, PlayerItem } from '../models/items';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {

    client:Client;
    databases:Databases;
    storage:Storage;
    teams:Teams;
    functions:Functions;
    currentPlayer:Player|null = null;
    DEFAULT_CHARACTER_PORTRAIT = "assets/illustrations/default_character.jpg"

    constructor(private auth:AuthentificationService,private toast:ToastService) {

        this.client = new Client();
        this.client
            .setEndpoint(environment.API_URL) // Your API Endpoint
            .setProject(environment.PROJECT_ID) // Your project ID
        ;
        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);
        this.teams = new Teams(this.client);
        this.functions = new Functions(this.client);
    }

    

    GetImageUrlPreview(id:string):string{
        if(id == undefined || id == "" || id === this.DEFAULT_CHARACTER_PORTRAIT)
            return this.DEFAULT_CHARACTER_PORTRAIT;
        let result = this.storage.getFilePreview(environment.PROFILES_STORAGE_ID, id);
        return result.href;
    }

    async LoadPlayer(gameID:string): Promise<Player|undefined> {
        let players = await this.GetPlayers(gameID);
        //check if the user is already in the game
        let userPlayer = players.find((player) => player.ownerID == this.auth.GetUserID());
        if(userPlayer != undefined){
            this.currentPlayer = userPlayer;
        }
        return userPlayer;
    }

    FormatAttributes(attributes:any[]):GameAttribute[]{
        return attributes.map((atr) => {
            return {
                id: atr.$id,
                value: atr.value,
                valueAddition: atr.valueAddition,
                name: atr.attribute.name,
                baseValue: atr.attribute.baseValue,
            }
        });
    }

    async GetPlayers(gameID:string): Promise<Player[]> {

        let players:Player[]= new Array<Player>();
        
        try{
            let result = await this.databases.listDocuments(environment.DATABASE_ID, environment.PLAYER_COLLECTION_ID, [Query.equal('gameID',gameID)]);
            result.documents.forEach((doc) => {
                let p = this.MapAnyToPlayer(doc);
                players.push(p);
            });

            for (let i = 0; i < players.length; i++) {
                players[i].inventory = await this.LoadPlayerInventory(players[i].id);
            }
        }
        catch(error){
            console.log(error);
        }
        return players;
    }

    MapAnyToPlayer(doc:any):Player{
        return {
            id: doc.$id,
            gameID: doc.gameID,
            ownerID: doc.ownerID,
            imageID: doc.imageID,
            name: doc.name,
            money: doc.money,
            statPoints: doc.statPoints,
            attributes: this.FormatAttributes(doc.attributes),
            inventory:[]
        }
    }

    GetGamesAttributesForPlayer(game:Game): any[] {
        return game.attributes.map((atr) => {
            return {
                $id:ID.unique(),
                value: atr.baseValue,
                valueAddition: atr.valueAddition,
                attribute : atr.id

            }
        });
    }

    async UploadPlayerImage(file:File | null,teamID:string,userID:string): Promise<string> {
        let imageID
        //upload image
        if(file != null){

            let image = await this.storage.createFile(environment.PROFILES_STORAGE_ID,ID.unique(),file,[
                Permission.read(Role.team(teamID)),
                
                //user all permissions on his own files
                Permission.read(Role.user(userID)),
                Permission.write(Role.user(userID)),
                Permission.update(Role.user(userID)),
                Permission.delete(Role.user(userID))
                
            ] );
            imageID = image.$id;
        }
        else{
            imageID = this.DEFAULT_CHARACTER_PORTRAIT;
        }
        return imageID;
    }

    async CreatePlayer(name:string,portrait:File|null,game:Game): Promise<Response> {
        
        let response:Response;
        let userID = this.auth.GetUserID();

        try{
            this.toast.ShowLoading("Creating the player "+name);
            let imageID= await this.UploadPlayerImage(portrait,game.teamID,userID);
            //create player
            let playerData={
                gameID: game.id,
                ownerID: this.auth.GetUserID(),
                imageID: imageID,
                name: name,
                money: game.baseMoney,
                statPoints: game.baseStatPoints,
                attributes: this.GetGamesAttributesForPlayer(game)
            }
            await this.databases.createDocument(environment.DATABASE_ID, environment.PLAYER_COLLECTION_ID, ID.unique() , playerData, [
                //team permissions for read
                Permission.read(Role.team(game.teamID)),
                Permission.delete(Role.team(game.teamID)),
                Permission.update(Role.team(game.teamID)),
                //owner permissions
                Permission.read(Role.user(playerData.ownerID)),
                Permission.delete(Role.user(playerData.ownerID)),
                Permission.update(Role.user(playerData.ownerID)),

                //team (owner permissions don't work, to investigate)
                // Permission.delete(Role.team(game.teamID, 'owner')),
                // Permission.update(Role.team(game.teamID, 'owner')),
             ]);
             
            response = {value:'Player created',type:ResponseType.Success}
        }
        catch(error){
            console.log(error);
            response = {value:getErrorMessage(error),type:ResponseType.Error}
        }

        this.toast.HideLoading();
        this.toast.Show(response.value,response.type);
        return response
    }

    async DeletePlayer(playerID:string): Promise<Response> {
        let response:Response;
        try{
            await this.databases.deleteDocument(environment.DATABASE_ID, environment.PLAYER_COLLECTION_ID, playerID);
            response = {value:'Player deleted',type:ResponseType.Success};
        }
        catch(error){
            console.log(error);
            response= {value:getErrorMessage(error),type:ResponseType.Error};
        }
        return response;
    }


    async UpdateAttribute(attributeID:string,data:Object) : Promise<Response> {
        let response:Response;
        try{
            await this.databases.updateDocument(environment.DATABASE_ID, environment.PLAYERATTRIBUTES_COLLECTION_ID, attributeID, data);
            response = {value:'Attribute updated',type:ResponseType.Success};
        }
        catch(error){
            console.log(error);
            response= {value:getErrorMessage(error),type:ResponseType.Error};
        }
        this.toast.Show(response.value,response.type);
        return response;

    }

    async UpdatePlayer(playerID:string,data:Object) : Promise<Response> {
        let response:Response;
        try{
            await this.databases.updateDocument(environment.DATABASE_ID, environment.PLAYER_COLLECTION_ID, playerID, data);
            response = {value:'Player updated',type:ResponseType.Success};
        }
        catch(error){
            console.log(error);
            response= {value:getErrorMessage(error),type:ResponseType.Error};
        }
        this.toast.Show(response.value,response.type);
        return response;
    }

    async LoadPlayerInventory(playerID:string):Promise<PlayerItem[]>{
        let items:PlayerItem[] = [];
        try{
            this.toast.ShowLoading("Loading inventory");
            let result = await this.databases.listDocuments(environment.DATABASE_ID, environment.PLAYERITEMS_COLLECTION_ID,[Query.equal("playerID", playerID)]);
            result.documents.forEach((doc:any) => {
                    let item:PlayerItem = {
                        playerItemID:doc.playerID,
                        playerID:doc.playerID,
                        equiped:doc.equiped,
                        inventorySlotPosition:doc.slotID,
                        id:doc.item.$id,
                        name:doc.item.name,
                        description:doc.item.description,
                        price:doc.item.price,
                        slot:doc.item.slot,
                        imageID:doc.item.imageID,
                        type:doc.item.type,
                        rarity:doc.item.rarity,
                        attributes:FormatAttributeForLoad(doc.item.attributes),
                    }
                    items.push(item);
            });
        }
        catch(error){
            console.log(error);
        }

        this.toast.HideLoading();
        return items;
    }

    async GiveItem(playerID:string,teamID:string,item:Item):Promise<Response>
    {
        let response:Response;
        //load player inventory to find the first available slot (start from 0)
        let inventory = await this.LoadPlayerInventory(playerID);
        //sort inventory by slot position
        inventory.sort((a,b) => (a.inventorySlotPosition > b.inventorySlotPosition) ? 1 : ((b.inventorySlotPosition > a.inventorySlotPosition) ? -1 : 0));
        
        //find first slot available
        let slot = 0;
        for(let i = 0; i < inventory.length; i++){
            if(inventory[i].inventorySlotPosition != slot){
                break;
            }
            slot++;
        }

        //give item to player
        let playerItemData = {
            slotID:slot,
            item:item.id,
            equipped:false,
            playerID:playerID,
        }

        try{
            await this.databases.createDocument(environment.DATABASE_ID, environment.PLAYERITEMS_COLLECTION_ID, ID.unique() , playerItemData, [
                //team permissions for read
                Permission.read(Role.team(teamID)),
                Permission.delete(Role.team(teamID)),
                Permission.update(Role.team(teamID)),
             ]);
             response = {value:'Item given',type:ResponseType.Success};
            }
        catch(error){
            console.log(error);
            response= {value:getErrorMessage(error),type:ResponseType.Error};
        }

        this.toast.Show(response.value,response.type);
        return response;
    }

}