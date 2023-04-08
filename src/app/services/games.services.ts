import { Injectable } from '@angular/core';
import { Client, Databases, ID, Storage, Teams} from "appwrite";
import { DATABASE_ID,GAMES_PREVIEWS_ID, GAMES_COLLECTION_ID, API_URL, PROJECT_ID, DEFAULT_GAME_PREVIEW, ATTRIBUTES_COLLECTION_ID, GAMES_ATTRIBUTES_COLLECTION_ID } from './endpoints';
import { getErrorMessage } from '../Utils/utils';
import { ResponseType, Response } from '../models/responses';
import { AuthentificationService } from './auth.services';
import { Game, GameAttribute } from '../models/games';

@Injectable({
  providedIn: 'root'
})
export class GamesService {

    client:Client;
    databases:Databases;
    storage:Storage;
    teams:Teams;

    constructor(private auth:AuthentificationService) {

        this.client = new Client();
        this.client
            .setEndpoint(API_URL) // Your API Endpoint
            .setProject(PROJECT_ID) // Your project ID
        ;
        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);
        this.teams = new Teams(this.client);
    }

    async LoadGames(){
        await this.auth.CheckConnection();
        
        let games:Game[] = [];

        try{
            const response = await this.databases.listDocuments(DATABASE_ID, GAMES_COLLECTION_ID);
            console.log(response);
            games = response.documents.map((doc:any) => {
                return {
                    id:doc.$id,
                    name:doc.name,
                    description:doc.description,
                    image:this.GetImageUrlPreview(doc.image),
                    host:doc.host
                }
            });
        }catch(error){
            console.log(error);
        }

        return games;
    }

    async CreateGame(gameData:Game,image:File,attributes:GameAttribute[]): Promise<Response> {

        let val:string;
        let type:ResponseType;
        try{

            //step 1: create a team for the game 
            const team = await this.teams.create(ID.unique(), gameData.name);
            console.log('team :',team);

            //step 2: upload the image if not default one
            let imageID:string;
            if(gameData.image !== 'assets/illustrations/default_icon.jpg'){
                const img = await this.storage.createFile(GAMES_PREVIEWS_ID, ID.unique(), image);
                console.log('image :',img);
                imageID = img.$id;
            }else{
                imageID = DEFAULT_GAME_PREVIEW;
            }
                
            //step 2: create the game
            const game = await this.databases.createDocument(DATABASE_ID, GAMES_COLLECTION_ID, ID.unique(), {
                name: gameData.name,
                host: this.auth.GetUserID(),
                description: gameData.description,
                image: imageID, //!TODO FIX : Invalid document structure: Attribute "image" has invalid format. Value must be a valid URL
                team: team.$id
            });
            console.log(game);
            
            //step 3: add the attributes to the game
            attributes.forEach(async (attribute) => {
                let atr = await this.databases.createDocument(DATABASE_ID, ATTRIBUTES_COLLECTION_ID, ID.unique(), {
                    name: attribute.name,
                });
                //add the attribute to the game
                this.databases.createDocument(DATABASE_ID, GAMES_ATTRIBUTES_COLLECTION_ID, ID.unique(), {
                    gameID: game.$id,
                    attributeID: atr.$id,
                    defaultValue: attribute.baseValue
                });
            });

            val = "The game has been created";
            type = ResponseType.Success;
        }catch(error){
            val = getErrorMessage(error);
            type = ResponseType.Error;
        }

        return {value:val,type:type}
    }

    async DeleteGame(id:string): Promise<Response> {

        let val:string;
        let type:ResponseType;

        try{
            //TODO
            //make all the user leave the game, ending with the host
            val = "The game has been deleted";
            type = ResponseType.Success;
        }catch(error){
            val = getErrorMessage(error);
            type = ResponseType.Error;
        }

        return {value:val,type:type}
    }

    async JoinGame(id:string): Promise<Response> {

        let val:string;
        let type:ResponseType;

        try{
            //TODO
            //add user to the team list
            val = "You have joined the game";
            type = ResponseType.Success;
        }catch(error){
            val = getErrorMessage(error);
            type = ResponseType.Error;
        }

        return {value:val,type:type}
    }

    async LeaveGame(id:string): Promise<Response> {

        let val:string;
        let type:ResponseType;

        try{
            //TODO
            //delete the user character from the game
            //include : Items, Attribute, Character
            //delete the user from the team list (if host, delete the game then team)
            val = "You have left the game";
            type = ResponseType.Success;
        }catch(error){
            val = getErrorMessage(error);
            type = ResponseType.Error;
        }

        return {value:val,type:type}
    }

    GetImageUrlPreview(id:string):string{
        const result = this.storage.getFilePreview(GAMES_PREVIEWS_ID, id);
        return result.href;
    }


}