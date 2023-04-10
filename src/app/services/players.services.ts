import { Injectable } from '@angular/core';
import { Client, Databases, Functions, ID, Permission, Query, Role, Storage, Teams} from "appwrite";
import { DATABASE_ID,GAMES_PREVIEWS_ID, GAMES_COLLECTION_ID, API_URL, PROJECT_ID, DEFAULT_GAME_PREVIEW, ATTRIBUTES_COLLECTION_ID, SERVER_FUNCTIONS, PROFILES_ID, DEFAULT_CHARACTER_PORTRAIT_ID } from '../Utils/appwrite.values.utils';
import { getErrorMessage } from '../Utils/utils';
import { ResponseType, Response } from '../models/responses';
import { AuthentificationService } from './auth.services';
import { Game, GameAttribute, Player } from '../models/games';
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

    constructor(private auth:AuthentificationService,private toast:ToastService) {

        this.client = new Client();
        this.client
            .setEndpoint(API_URL) // Your API Endpoint
            .setProject(PROJECT_ID) // Your project ID
        ;
        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);
        this.teams = new Teams(this.client);
        this.functions = new Functions(this.client);
    }

    

    GetImageUrlPreview(id:string):string{
        let result = this.storage.getFilePreview(GAMES_PREVIEWS_ID, id);
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

    async GetPlayers(gameID:string): Promise<Player[]> {

        let players = new Array<Player>();
        
        try{
            let result = await this.functions.createExecution(SERVER_FUNCTIONS.getPlayers,
                JSON.stringify({playerID:this.auth.GetUserID(),gameID:gameID}));
            let response = JSON.parse(result.response);
            players = response.players.map((doc:any) => {
                return {
                    id: doc.$id,
                    gameID: doc.gameID,
                    ownerID: doc.ownerID,
                    imageID: doc.imageID,
                    name: doc.name,
                    money: doc.money,
                    attributes: doc.attributes,
                }
            });
        }
        catch(error){
            console.log(error);
        }
        return players;
    }

    async CreatePlayer(name:string,portrait:File|null,game:Game): Promise<Response> {
        
        let response:Response;
        let userID = this.auth.GetUserID();

        try{
            let imageID:string;
            //upload image
            if(portrait != null){

                let image = await this.storage.createFile(PROFILES_ID,ID.unique(),portrait,[
                    Permission.read(Role.team(game.teamID)),
                    
                    //user all permissions on his own files
                    Permission.read(Role.user(userID)),
                    Permission.write(Role.user(userID)),
                    Permission.update(Role.user(userID)),
                    Permission.delete(Role.user(userID))
                    
                ] );
                imageID = image.$id;
            }
            else{
                imageID = DEFAULT_CHARACTER_PORTRAIT_ID;
            }
            let result = await this.functions.createExecution(SERVER_FUNCTIONS.createPlayer,
                JSON.stringify({
                    player:{
                        gameID: game.id,
                        ownerID: this.auth.GetUserID(),
                        imageID: imageID,
                        name: name,
                        money: 0
                    },
                    teamID:game.teamID
                }));
            console.log("result",result)
            
            if(result.statusCode == 200)
                response = {value:'Player created',type:ResponseType.Success}
            else
                response = {value:'Error creating player',type:ResponseType.Error}
        }
        catch(error){
            console.log(error);
            response = {value:getErrorMessage(error),type:ResponseType.Error}
        }

        this.toast.Show(response.value,response.type);
        return response
    }


}