import { Injectable } from '@angular/core';
import { Client, Databases, Functions, ID, Permission, Query, Role, Storage, Teams} from "appwrite";
import { environment } from 'src/environments/environment';
import { getErrorMessage } from '../Utils/utils';
import { ResponseType, Response } from '../models/responses';
import { AuthentificationService } from './auth.services';
import { Game, GameAttribute, MoneyFormat, Player } from '../models/games';
import { ToastService } from './toast.services';

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

        let players = new Array<Player>();
        
        try{
            let result = await this.databases.listDocuments(environment.DATABASE_ID, environment.PLAYER_COLLECTION_ID, [Query.equal('gameID',gameID)]);
            players = result.documents.map((doc:any) => {
                return this.MapAnyToPlayer(doc);
            });
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
            attributes: this.FormatAttributes(doc.attributes)
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

    FormatMoney(money:number,type:MoneyFormat):string{
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
                return this.GetFantasyCoinsFormat(money);
            default:
                return "$"+money;
        }

    }

    GetFantasyCoinsFormat(n:number):string{
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

}