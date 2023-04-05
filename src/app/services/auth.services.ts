import { Injectable } from '@angular/core';
import { Client, Account, ID, Models } from "appwrite";
import { API_URL, PROJECT_ID } from './endpoints';
import { getErrorMessage } from '../Utils/utils';
import { ResponseType, Response } from '../models/responses';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

    client!:Client;
    account!:Account;
    session!:Models.Account<Models.Preferences> | null;
    isConnected!:boolean;

    constructor() {
        this.isConnected=false;
        this.client = new Client();
        this.client
        .setEndpoint(API_URL) // Your API Endpoint
        .setProject(PROJECT_ID) // Your project ID
        ;

        this.account = new Account(this.client);
        this.CheckConnection();
    }

    async CreateAccount(email:string,password:string): Promise<Response>{
        const account = new Account(this.client);
        let val:string;
        let type:ResponseType;

        try{
            await account.create(ID.unique(),email,password)
            val = "The account has been created";
            type = ResponseType.Success;
        }catch(error){
            val = getErrorMessage(error);
            type = ResponseType.Error;
        }

        return {value:val,type:type}
    }

    async Login(email:string,password:string): Promise<Response> {
        this.account = new Account(this.client);
        let val:string;
        let type:ResponseType;

        try{
            await this.account.createEmailSession(email,password);
            val = "Logged in";
            type = ResponseType.Success;
        }catch(error){
            val = getErrorMessage(error);
            type = ResponseType.Error;
        }

        this.CheckConnection();

        return {value:val,type:type};
    }

    async Logout(): Promise<Response>
    {
        let val:string;
        let type:ResponseType;

        try {
            await this.account.deleteSessions();
            this.isConnected = false;
            val = "Logged out";
            type = ResponseType.Success;
        } catch (error) {
            val = getErrorMessage(error);
            type = ResponseType.Error;
        }

        return {value:val,type:type};
    }


    async CheckConnection() {

        if(this.account == null){
            this.isConnected = false;
        }

        try {
            const session = await this.account.get();
            if (session) {
                this.isConnected = true;
                this.session = session;
            }
        } catch (error) {
            console.log("error when connecting",error)
            this.isConnected = false;
            this.session = null;
        }

        console.log("Is connected: " + this.isConnected)
    }

    GetUserID():string{
        return (this.session == null) ? "" : this.session.$id;
    }

    DeleteAccount(){
        //TODO
    }

   
}