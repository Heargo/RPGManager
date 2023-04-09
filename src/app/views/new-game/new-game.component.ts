import {  Component } from '@angular/core';
import { Game, GameAttribute } from 'src/app/models/games';
import { GamesService } from 'src/app/services/games.services';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ResponseType } from 'src/app/models/responses';
import { Router } from '@angular/router';
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

  constructor(private games:GamesService, private sanitizer:DomSanitizer,private router:Router) { }

  onAddAttribute(){
    //if attribute name not in attributes array and attribute name not empty 
    if(!this.attributes.find(a => a.name === this.attributeName) && this.attributeName !== ''){
      this.attributes.push({name: this.attributeName, baseValue: this.attributeDefaultValue});
      this.attributeName = '';
      this.attributeDefaultValue = 0;
    }
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
    if(this.game.image === '') return false;

    return true;
  }

  async onCreateGame(){
    if(!this.isValidGame()) return;

    const response = await this.games.CreateGame(this.game, this.imageFile, this.attributes);

    if(response.type === ResponseType.Success){
      this.router.navigate(['/games']);
    }

  }

  onUploadImage(){
    //this.games.uploadImage();
  }

}
