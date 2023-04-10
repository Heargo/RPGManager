import { Injectable } from '@angular/core';
import { Client, Databases, Functions, ID, Permission, Query, Role, Storage, Teams} from "appwrite";
import { DATABASE_ID,GAMES_PREVIEWS_ID, GAMES_COLLECTION_ID, API_URL, PROJECT_ID, DEFAULT_GAME_PREVIEW, ATTRIBUTES_COLLECTION_ID, SERVER_FUNCTIONS } from '../Utils/appwrite.values.utils';
import { getErrorMessage } from '../Utils/utils';
import { ResponseType, Response } from '../models/responses';
import { AuthentificationService } from './auth.services';
import { Game, GameAttribute, Player } from '../models/games';
import { ToastService } from './toast.services';

@Injectable({
  providedIn: 'root'
})
export class GamesService {

    client:Client;
    databases:Databases;
    storage:Storage;
    teams:Teams;
    functions:Functions;
    currentGame:Game | null;

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
        this.currentGame = null;
    }

    ConnectToGame(game:Game) {
        this.currentGame = game;
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
                    image:doc.imageID,
                    host:doc.hostID,
                    teamID:doc.teamID
                }
            });

        }catch(error){
            console.log(error);
            this.toast.Show("Can't load games",ResponseType.Error);
        }

        return games;
    }

    async CreateGame(gameData:Game,image:File,attributes:GameAttribute[]): Promise<Response> {

        let val:string;
        let type:ResponseType;
        try{

            //step 1: create a team for the game 
            const team = await this.teams.create(ID.unique(), gameData.name);

            //step 2: upload the image if not default one
            let imageID:string;
            //we compare the image url with the default one since it's comming from the front app
            //and we gat and url from it and not an id. However we will save the id in the database
            if(gameData.image !== 'assets/illustrations/default_icon.jpg' && image.size < 2){
                const img = await this.storage.createFile(GAMES_PREVIEWS_ID, ID.unique(), image);
                imageID = img.$id;
            }else{
                imageID = DEFAULT_GAME_PREVIEW;
            }
            const hostID = this.auth.GetUserID();
            //step 2: create the game
            const game = await this.databases.createDocument(DATABASE_ID, GAMES_COLLECTION_ID, ID.unique(), {
                name: gameData.name,
                hostID: hostID,
                description: gameData.description,
                imageID: imageID, 
                teamID: team.$id
            },
            [
                //team permissions for read
                Permission.read(Role.team(team.$id)),
                //host permissions
                Permission.read(Role.user(hostID)),
                Permission.write(Role.user(hostID)),
                Permission.delete(Role.user(hostID)),
                Permission.update(Role.user(hostID))
            ]
            );
            
            //step 3: add the attributes to the game
            attributes.forEach(async (attribute) => {
                let atr = await this.databases.createDocument(DATABASE_ID, ATTRIBUTES_COLLECTION_ID, ID.unique(), {
                    name: attribute.name,
                    gameID: game.$id,
                    baseValue: attribute.baseValue
                });
            });

            val = "The game has been created";
            type = ResponseType.Success;
        }catch(error){
            val = getErrorMessage(error);
            type = ResponseType.Error;
        }

        this.toast.Show(val,type);
        return {value:val,type:type}
    }

    async DeleteGame(game:Game): Promise<Response> {

        let val:string;
        let type:ResponseType;

        try{
            await this.teams.delete(game.teamID);
            console.log("team deleted")
            await this.databases.deleteDocument(DATABASE_ID, GAMES_COLLECTION_ID, game.id);
            console.log("game deleted")
            if(game.image !== DEFAULT_GAME_PREVIEW){
                await this.storage.deleteFile(GAMES_PREVIEWS_ID, game.image);
                console.log("game preview deleted")
            }
            //delete attributes
            const attributes = await this.databases.listDocuments(DATABASE_ID, ATTRIBUTES_COLLECTION_ID,[Query.equal('gameID',game.id)]);
            attributes.documents.forEach(async (attribute) => {
                this.databases.deleteDocument(DATABASE_ID, ATTRIBUTES_COLLECTION_ID, attribute.$id);
            });
            console.log("attributes deleted")
            val = "The game has been deleted";
            type = ResponseType.Success;
        }catch(error){
            val = getErrorMessage(error);
            type = ResponseType.Error;
        }

        this.toast.Show(val,type);
        return {value:val,type:type}
    }

    async JoinGame(id:string): Promise<Response> {

        let val:string;
        let type:ResponseType;

        try{
            //call server function joinTeam
            //get user email
            const email = this.auth.session?.email;
            console.log(email)
            let data = JSON.stringify({email:email,teamID:id});
            const result = await this.functions.createExecution('64334bdf525fa8020b93', data);
            console.log(result);
            val = "You have joined the game";
            type = ResponseType.Success;
        }catch(error){
            val = getErrorMessage(error);
            type = ResponseType.Error;
        }

        this.toast.Show(val,type);
        return {value:val,type:type}
    }

    async LeaveGame(game:Game): Promise<Response> {

        let val:string;
        let type:ResponseType;

        try{
            //TODO
            //delete the user character from the game
            //include : Items, Attribute, Character
            //delete the user from the team list
            //get user membership id
            const memberships = await this.teams.listMemberships(game.teamID);
            const membership = memberships.memberships.find((m) => m.$id === this.auth.GetUserID());
            console.log(membership);
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