import { Injectable } from '@angular/core';
import { Client, Databases, Functions, ID, Permission, Query, Role, Storage, Teams} from "appwrite";
import { DATABASE_ID, API_URL, PROJECT_ID, SERVER_FUNCTIONS, GAME_COLLECTION_ID, ATTRIBUTE_COLLECTION_ID, GAMEPREVIEWS_STORAGE_ID, PLAYER_COLLECTION_ID } from '../environment';
import { getErrorMessage } from '../Utils/utils';
import { ResponseType, Response } from '../models/responses';
import { AuthentificationService } from './auth.services';
import { Game, GameAttribute, Player } from '../models/games';
import { ToastService } from './toast.services';
import { PlayersService } from './players.services';

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
    DEFAULT_GAME_PREVIEW = "assets/illustrations/default_icon.jpg";

    constructor(private auth:AuthentificationService,private toast:ToastService,private playersService:PlayersService) {

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

    MapAttributes(attributes:any[]):GameAttribute[]{
        return attributes.map((attr:any) => {
            return {
                id: attr.$id,
                name: attr.name,
                baseValue: attr.baseValue,
                valueAddition: 0,
                value: attr.baseValue
            }
        });
    }

    async LoadGames(){
        await this.auth.CheckConnection();
        
        let games:Game[] = [];

        try{
            const response = await this.databases.listDocuments(DATABASE_ID, GAME_COLLECTION_ID);
            games = response.documents.map((doc:any) => {
                return {
                    id:doc.$id,
                    name:doc.name,
                    description:doc.description,
                    image:doc.imageID,
                    host:doc.hostID,
                    teamID:doc.teamID,
                    attributes:this.MapAttributes(doc.attributes)
                }
            });

        }catch(error){
            console.log(error);
            this.toast.Show("Can't load games",ResponseType.Error);
        }
        console.log(games);
        return games;
    }

    async CreateGame(gameData:Game,image:File): Promise<Response> {

        let val:string;
        let type:ResponseType;
        try{
            this.toast.ShowLoading("Creating the game");
            //step 1: create a team for the game 
            const team = await this.teams.create(ID.unique(), gameData.name);

            //step 2: upload the image if not default one
            let imageID:string;
            //we compare the image url with the default one since it's comming from the front app
            //and we gat and url from it and not an id. However we will save the id in the database
            if(gameData.image !== 'assets/illustrations/default_icon.jpg' && image.size < 2){
                const img = await this.storage.createFile(GAME_COLLECTION_ID, ID.unique(), image);
                imageID = img.$id;
            }else{
                imageID = this.DEFAULT_GAME_PREVIEW;
            }
            const hostID = this.auth.GetUserID();

            let atrs = gameData.attributes.map((atr) => {
                return {
                    name:atr.name,
                    baseValue:atr.baseValue,
                    $id:ID.unique()
                }
            });
            //step 2: create the game
            const game = await this.databases.createDocument(DATABASE_ID, GAME_COLLECTION_ID, ID.unique(), {
                name: gameData.name,
                hostID: hostID,
                description: gameData.description,
                imageID: imageID, 
                teamID: team.$id,
                attributes: atrs
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
            
            // //step 3: add the attributes to the game
            // attributes.forEach(async (attribute) => {
            //     let atr = await this.databases.createDocument(DATABASE_ID, ATTRIBUTE_COLLECTION_ID, ID.unique(), {
            //         name: attribute.name,
            //         gameID: game.$id,
            //         baseValue: attribute.baseValue
            //     });
            // });

            //fake waiting time
            await new Promise(resolve => setTimeout(resolve, 3000));

            val = "The game has been created";
            type = ResponseType.Success;
        }catch(error){
            val = getErrorMessage(error);
            type = ResponseType.Error;
        }

        

        this.toast.HideLoading();
        this.toast.Show(val,type);
        return {value:val,type:type}
    }

    async DeleteGame(game:Game): Promise<Response> {

        let val:string;
        let type:ResponseType;

        try{
            this.toast.ShowLoading("Deleting the game");
            await this.teams.delete(game.teamID);
            console.log("team deleted")
            await this.databases.deleteDocument(DATABASE_ID, GAME_COLLECTION_ID, game.id);
            console.log("game deleted")
            if(game.image !== this.DEFAULT_GAME_PREVIEW){
                await this.storage.deleteFile(GAMEPREVIEWS_STORAGE_ID, game.image);
                console.log("game preview deleted")
            }

            //delete all players
            let players = await this.databases.listDocuments(DATABASE_ID, PLAYER_COLLECTION_ID,[Query.equal('gameID',game.id)]);
            players.documents.forEach(async (player) => {
                await this.playersService.DeletePlayer(player.$id);
            });
            console.log("all players deleted")

            val = "The game has been deleted";
            type = ResponseType.Success;
        }catch(error){
            val = getErrorMessage(error);
            type = ResponseType.Error;
        }

        this.toast.HideLoading();
        this.toast.Show(val,type);
        return {value:val,type:type}
    }

    async JoinGame(id:string): Promise<Response> {

        let val:string;
        let type:ResponseType;

        try{
            this.toast.ShowLoading("Joining the game");
            //call server function joinTeam
            //get user email
            let email = this.auth.session?.email;
            console.log(email)
            let data = JSON.stringify({email:email,teamID:id});
            let result = await this.functions.createExecution(SERVER_FUNCTIONS.joinTeam, data);
            if(result.statusCode !== 200)
                throw new Error("Can't join the game, verify the invitation code and try again");

            val = "You have joined the game";
            type = ResponseType.Success;
        }catch(error){
            val = getErrorMessage(error);
            type = ResponseType.Error;
        }

        this.toast.HideLoading();
        this.toast.Show(val,type);
        return {value:val,type:type}
    }

    async LeaveGame(game:Game): Promise<Response> {

        let val:string;
        let type:ResponseType;

        try{
            this.toast.ShowLoading("Leaving the game");
            let players = await this.playersService.GetPlayers(game.id);
            let player = players.find((p) => p.ownerID === this.auth.GetUserID());
            if(player!==undefined)
                await this.playersService.DeletePlayer(player.id);

            let memberships = await this.teams.listMemberships(game.teamID);
            console.log("memberships",memberships)
            let membership = memberships.memberships.find((m) => m.userId === this.auth.GetUserID());
            console.log("membership",membership)
            if(membership!==undefined)
                await this.teams.deleteMembership(game.teamID, membership.$id);

            val = "You have left the game";
            type = ResponseType.Success;
        }catch(error){
            val = getErrorMessage(error);
            type = ResponseType.Error;
        }

        this.toast.HideLoading();
        this.toast.Show(val,type);
        return {value:val,type:type}
    }

    GetImageUrlPreview(id:string):string{
        const result = this.storage.getFilePreview(GAMEPREVIEWS_STORAGE_ID, id);
        return result.href;
    }

}