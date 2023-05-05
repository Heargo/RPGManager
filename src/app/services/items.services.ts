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

export class ItemsService {

    client:Client;
    databases:Databases;
    storage:Storage;
    teams:Teams;
    functions:Functions;
    currentPlayer:Player|null = null;
    DEFAULT_ITEM_ICON = "assets/illustrations/default_item.jpg"

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
        console.log("id is ",id)
        if(id == undefined || id == "" || id === this.DEFAULT_ITEM_ICON)
            return this.DEFAULT_ITEM_ICON;
        //if is object return it
        if(typeof id === "object")
            return id;
        
        let result = this.storage.getFilePreview(environment.ITEMS_STORAGE_ID, id);
        return result.href;
    }
}  