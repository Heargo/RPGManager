import {  Component } from '@angular/core';
import { Game, GameAttribute } from 'src/app/models/games';
import { GamesService } from 'src/app/services/games.services';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ResponseType } from 'src/app/models/responses';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.services';
import { MAX_FILE_SIZE, MAX_GAME_ATTRIBUTE_NAME_SIZE, MAX_GAME_DESCRIPTION_SIZE, MAX_GAME_NAME_SIZE, MIN_GAME_ATTRIBUTE_DEFAULTVALUE } from 'src/app/Utils/appwrite.values.utils';
@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.scss']
})
export class NewGameComponent {

  attributes:GameAttribute[] = [
    {name: 'Strength', baseValue: 0},
    {name: 'Dexterity', baseValue: 0},
    {name: 'Constitution', baseValue: 0},
    {name: 'Intelligence', baseValue: 0},
    {name: 'Wisdom', baseValue: 0},
    {name: 'Charisma', baseValue: 0}
  ];
  attributeName = '';
  attributeDefaultValue = 0;
  accordions = {'description':true, 'attributes':true};
  game:Game = {
    id: '',
    name: '',
    description: '',
    image: 'assets/illustrations/default_icon.jpg',
    host: '',
    teamID:''
  };
  imageFile:File = new File([], 'default_icon.jpg');

  constructor(private games:GamesService, private sanitizer:DomSanitizer,private router:Router, private toast:ToastService) { }

  onAddAttribute(){
    //max attribute name length is 40
    if(this.attributeName.length > MAX_GAME_ATTRIBUTE_NAME_SIZE) { this.toast.Show('Attribute name is too long, max 40 characters', ResponseType.Warning);return;}
    //min attribute default value is 0
    if(this.attributeDefaultValue < MIN_GAME_ATTRIBUTE_DEFAULTVALUE) { this.toast.Show('Attribute default value is too low, min 0', ResponseType.Warning);return;}
    //if attribute name already exist
    if(this.attributes.find(a => a.name === this.attributeName)) { this.toast.Show('Attribute name already exist', ResponseType.Warning);return;}
    //if attribute name is empty
    if(this.attributeName === '') { this.toast.Show('Attribute name is empty', ResponseType.Warning);return;}

    this.attributes.push({name: this.attributeName, baseValue: this.attributeDefaultValue});
    this.attributeName = '';
    this.attributeDefaultValue = 0;
  }

  getUrlPreview():SafeUrl{
    return this.sanitizer.bypassSecurityTrustUrl(this.game.image);
  }

  isActive(str:string):boolean{
    if(str === 'description') return this.accordions.description;
    else if(str === 'attributes') return this.accordions.attributes;
    else return false;
  }

  onIconChange(event:any){
    if(event.target.files[0]){
      this.game.image = URL.createObjectURL(event.target.files[0]);
      this.imageFile = event.target.files[0];
    }
  }

  onDeleteAttribute(name:string){
    this.attributes = this.attributes.filter(a => a.name !== name);
  }

  isValidGame():boolean{
    if(this.game.name === '') return false;
    return true;
  }

  async onCreateGame(){
    if(!this.isValidGame()) return;

    //size file is 2 MB max
    if(this.imageFile.size > MAX_FILE_SIZE) { this.toast.Show('Image size is too big, max 2MB', ResponseType.Warning);return;}
    //max game name length is 40
    if(this.game.name.length > MAX_GAME_NAME_SIZE) { this.toast.Show('Game name is too long, max 40 characters', ResponseType.Warning);return;}
    //max game description length is 1000
    if(this.game.description.length > MAX_GAME_DESCRIPTION_SIZE) { this.toast.Show('Game description is too long, max 1000 characters', ResponseType.Warning);return;}
    //max attribute name length is 40
    if(this.attributes.find(a => a.name.length > MAX_GAME_ATTRIBUTE_NAME_SIZE)) { this.toast.Show('Attribute name is too long, max 40 characters', ResponseType.Warning);return;}
    //min attribute default value is 0
    if(this.attributes.find(a => a.baseValue < MIN_GAME_ATTRIBUTE_DEFAULTVALUE)) { this.toast.Show('Attribute default value must be greater than 0', ResponseType.Warning);return;}

    const response = await this.games.CreateGame(this.game, this.imageFile, this.attributes);

    if(response.type === ResponseType.Success){
      this.router.navigate(['/games']);
    }

  }

  onUploadImage(){
    //this.games.uploadImage();
  }

}
