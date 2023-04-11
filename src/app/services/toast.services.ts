import { Injectable } from '@angular/core';
import { ResponseType } from '../models/responses';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

    visible:boolean=false;
    message:string;
    loadingMessage:string = '';
    loading:boolean = false;
    type:ResponseType;
    triggerNumber:number;

    constructor() {
        this.visible=false;
        this.message= '';
        this.type= ResponseType.Success;
        this.triggerNumber= 0;
    }

    Show(message:string,type:ResponseType) {
        //console.log("TOAST",message,type)
        this.triggerNumber++
        this.HidePrevious()

        setTimeout(() => {
            this.visible = true
            this.message = message
            this.type = type

            setTimeout(() => {
                this.triggerNumber--
                if(this.triggerNumber == 0)
                    this.HidePrevious()
            }, Math.max(3*1000,Math.min(message.length*50,10*1000))) // 3s minimum, 10s maximum, 50ms per character (between 3s and 10s)
        }, 10)
        
    }

    ShowLoading(message:string) {
        this.loadingMessage = message
        this.loading = true
    }

    HideLoading() {
        this.loadingMessage = ''
        this.loading = false
    }

    HidePrevious() {
        this.visible = false
        this.message = ''
    }

    

}