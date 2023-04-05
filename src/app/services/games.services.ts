import { Injectable } from '@angular/core';
import { Client, Databases, Storage} from "appwrite";
import { DATABASE_ID,GAMES_PREVIEWS_ID, GAMES_COLLECTION_ID, API_URL, PROJECT_ID } from './endpoints';
import { getErrorMessage } from '../Utils/utils';
import { ResponseType, Response } from '../models/responses';
import { AuthentificationService } from './auth.services';
import { Game } from '../models/games';

@Injectable({
  providedIn: 'root'
})
export class GamesService {

    client:Client;
    databases:Databases;
    storage:Storage;

    constructor(private auth:AuthentificationService) {

        this.client = new Client();
        this.client
            .setEndpoint(API_URL) // Your API Endpoint
            .setProject(PROJECT_ID) // Your project ID
        ;
        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);
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

    GetImageUrlPreview(id:string):string{
        const result = this.storage.getFilePreview(GAMES_PREVIEWS_ID, id);
        return result.href;
    }

    async CreateGame(name:string,description:string,image:string): Promise<Response> {

        let val:string;
        let type:ResponseType;

        try{
            //TODO
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
            val = "You have left the game";
            type = ResponseType.Success;
        }catch(error){
            val = getErrorMessage(error);
            type = ResponseType.Error;
        }

        return {value:val,type:type}
    }

}