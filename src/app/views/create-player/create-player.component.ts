import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ResponseType } from 'src/app/models/responses';
import { GamesService } from 'src/app/services/games.services';
import { PlayersService } from 'src/app/services/players.services';
import { ToastService } from 'src/app/services/toast.services';

@Component({
  selector: 'app-create-player',
  templateUrl: './create-player.component.html',
  styleUrls: ['./create-player.component.scss']
})
export class CreatePlayerComponent {

  imageUrl = 'assets/illustrations/default_character.jpg';
  imageFile:File|null = null;
  name = '';

  constructor(private sanitizer:DomSanitizer,private games:GamesService,private players:PlayersService,private toast:ToastService) { }

  getUrlPreview():SafeUrl{
    return this.sanitizer.bypassSecurityTrustUrl(this.imageUrl);
  }

  onPlayerCreation(){

    if(this.games.currentGame === null){ this.toast.Show('No game selected', ResponseType.Error);return}
    if(this.name === ''){ this.toast.Show('Name is empty', ResponseType.Warning);return}
    
    this.players.CreatePlayer(this.name,this.imageFile,this.games.currentGame);
  }

  onIconChange(event:any){
    if(event.target.files[0]){
      this.imageUrl = URL.createObjectURL(event.target.files[0]);
      this.imageFile = event.target.files[0];
    }
  }
}
