import { Injectable } from '@angular/core';
import { ResponseType } from '../models/responses';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

    visible:boolean=false;
    message:string;
    type:ResponseType;
    triggerNumber:number;

    constructor() {
        this.visible=false;
        this.message= '';
        this.type= ResponseType.Success;
        this.triggerNumber= 0;
    }

    Show(message:string,type:ResponseType) {
        console.log("TOAST",message,type)
        this.triggerNumber++
        this.HidePrevious()

        setTimeout(() => {
            this.visible = true
            this.message = message
            this.type = type

            setTimeout(() => {
                this.triggerNumber--
                console.log(this.triggerNumber, 'triggerNumber','can we hide?',this.triggerNumber == 0)
                if(this.triggerNumber == 0)
                    this.HidePrevious()
            }, Math.max(3*1000,Math.min(message.length*50,10*1000))) // 3s minimum, 10s maximum, 50ms per character (between 3s and 10s)
        }, 10)
        
    }

    HidePrevious() {
        console.log('we hide')
        this.visible = false
        this.message = ''
    }

    

}