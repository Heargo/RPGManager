import { Injectable } from '@angular/core';
import { Client, Databases, Functions, ID, Permission, Query, Role, Storage, Teams} from "appwrite";
import { environment } from 'src/environments/environment';
import { FormatAttributeForLoad, FormatAttributesForUpload, getErrorMessage } from '../Utils/utils';
import { Response, ResponseType } from '../models/responses';
import { AuthentificationService } from './auth.services';
import { Game, GameAttribute, MoneyFormat, Player } from '../models/games';
import { ToastService } from './toast.services';
import { Item, PlayerItem } from '../models/items';

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
        if(id == undefined || id == "" || id === this.DEFAULT_ITEM_ICON)
            return this.DEFAULT_ITEM_ICON;
        //if is object return it
        if(typeof id === "object")
            return id;
        
        let result = this.storage.getFilePreview(environment.ITEMS_STORAGE_ID, id);
        return result.href;
    }

    async UploadItemImage(image:File,teamID:string,userID:string):Promise<string>{
        let result = await this.storage.createFile(environment.ITEMS_STORAGE_ID, ID.unique(), image, [
            //team permissions for read
            Permission.read(Role.team(teamID)),
            Permission.delete(Role.team(teamID)),
            Permission.update(Role.team(teamID)),
            //owner permissions
            Permission.read(Role.user(userID)),
            Permission.delete(Role.user(userID)),
            Permission.update(Role.user(userID)),
        ]);
        return result.$id;
    }

    async LoadItems(game:Game):Promise<Item[]>{
        let items:Item[] = [];
        let response:Response;
        try{
            this.toast.ShowLoading("Loading items");
            let result = await this.databases.listDocuments(environment.DATABASE_ID, environment.ITEM_COLLECTION_ID);
            //console.log(result.documents)
            result.documents.forEach((doc:any) => {
                if(doc.$permissions.find((perm: string | string[]) => (perm.includes(Role.team(game.teamID)) || perm.includes(Role.users()) ))){
                    let item:Item = {
                        id:doc.$id,
                        name:doc.name,
                        description:doc.description,
                        price:doc.price,
                        slot:doc.slot,
                        imageID:doc.imageID,
                        type:doc.type,
                        rarity:doc.rarity,
                        attributes:FormatAttributeForLoad(doc.attributes),
                    }
                    items.push(item);
                }
            })
            response = {value:'Items loaded',type:ResponseType.Success}
        }
        catch(error){
            console.log(error);
            response = {value:getErrorMessage(error),type:ResponseType.Error}
        }
        this.toast.HideLoading();
        this.toast.Show(response.value,response.type);
        return items;
    }

    async CreateItem(item:Item,itemImage:File|null,game:Game):Promise<Response>{
        let response:Response;
        let userID = this.auth.GetUserID();
        
        try{
            this.toast.ShowLoading("Creating the item "+item.name);
            let imageID = this.DEFAULT_ITEM_ICON;
            if(itemImage != null)
                imageID= await this.UploadItemImage(itemImage,game.teamID,userID);
            //create item
            let ItemData={
                name:item.name,
                description:item.description,
                price:item.price,
                slot:item.slot,
                imageID:imageID,
                type:item.type,
                rarity:item.rarity,
                attributes:FormatAttributesForUpload(item.attributes),
            }
            console.log('creating item with item data',ItemData)
            await this.databases.createDocument(environment.DATABASE_ID, environment.ITEM_COLLECTION_ID, ID.unique() , ItemData, [
                //team permissions for read
                Permission.read(Role.team(game.teamID)),
                Permission.delete(Role.team(game.teamID)),
                Permission.update(Role.team(game.teamID)),
                //owner permissions
                Permission.read(Role.user(userID)),
                Permission.delete(Role.user(userID)),
                Permission.update(Role.user(userID)),
             ]);
             
            response = {value:'Item created',type:ResponseType.Success}
        }
        catch(error){
            console.log(error);
            response = {value:getErrorMessage(error),type:ResponseType.Error}
        }

        this.toast.HideLoading();
        this.toast.Show(response.value,response.type);
        return response
    }

    async DeleteItem(item:Item):Promise<Response>{
        let response:Response;
        try{
            this.toast.ShowLoading("Deleting the item "+item.name);
            await this.databases.deleteDocument(environment.DATABASE_ID, environment.ITEM_COLLECTION_ID, item.id);
            if(item.imageID != this.DEFAULT_ITEM_ICON)
                await this.storage.deleteFile(environment.ITEMS_STORAGE_ID, item.imageID);
            response = {value:'Item deleted',type:ResponseType.Success}
        }
        catch(error){
            console.log(error);
            response = {value:getErrorMessage(error),type:ResponseType.Error}
        }
        this.toast.HideLoading();

        return response
    }

}  