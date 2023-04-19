import { FormGroup } from "@angular/forms";
import { GameAttribute } from "../models/games";

export function getErrorMessage(error: unknown) {
    if (error instanceof Error) return error.message
    return String(error)
  }
  
export function scroll(el: HTMLElement) {
    el.scrollIntoView({behavior: 'smooth'});
}

export function passwordMatchValidator(g: FormGroup) {
  return g.get('password')?.value === g.get('passwordConfirm')?.value
     ? null : {'mismatch': true};
}

export function hasPermission(permissions: string[], id: string) {
  let hasPermission = false;

  permissions.forEach((permission) => {
    if (permission.includes(id)) {
      hasPermission = true;
    }
  });
  
  return hasPermission;
}

export function GetAttributeProgress(attribute:GameAttribute){
  if(attribute == undefined) return {display:"0/0",prct:0}

  let display = attribute.value + "/" + (attribute.baseValue + attribute.valueAddition)+" "+attribute.name.toUpperCase(); 
  
  //case where max is 0
  if((attribute.baseValue + attribute.valueAddition) ==0) return {display:display,prct:0}
  return {display:display,prct:attribute.value/(attribute.baseValue + attribute.valueAddition)*100 }
}


export function BytesToMegaBytes(bytes:number){
  return bytes/1000000;
}