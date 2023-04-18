import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GamesService } from 'src/app/services/games.services';
import { PlayersService } from 'src/app/services/players.services';
import { Game, GameAttribute, Player } from 'src/app/models/games';
import { ToastService } from 'src/app/services/toast.services';
import { ResponseType } from 'src/app/models/responses';
import { Router } from '@angular/router';
import { AuthentificationService } from 'src/app/services/auth.services';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GetAttributeProgress } from 'src/app/Utils/utils';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  


  playerList!:Player[];
  game!:Game|null;
  isMJ:boolean = false;
  userNotes!:string;
  quickImages:{file:File;url:SafeUrl}[] = [];
  illustrationUnsubscribe!:any;
  illustration!:string;
  selectedPlayer:Player|null = null;
  lifeAttribute:GameAttribute = {id:"",name:"",value:0,baseValue:0,valueAddition:0};
  manaAttribute:GameAttribute = {id:"",name:"",value:0,baseValue:0,valueAddition:0};



  constructor(
      private auth:AuthentificationService,
      private players:PlayersService,
      private games:GamesService,
      private toast:ToastService,
      private router:Router,
      private sanitizer:DomSanitizer
      ) {}
      

  async ngOnInit(){
    this.game = this.games.currentGame;
    if(this.game == null){
      this.toast.Show("No game selected",ResponseType.Error);
      this.router.navigate(['/games']);
    }else{
      this.playerList = await this.players.GetPlayers(this.game.id);
    }
    this.isMJ = this.games.IsUserHost();
    this.userNotes = "default notes";

    //load player as selected player if not MJ
    if(!this.isMJ){
      let player = this.playerList.find(p => p.ownerID == this.auth.GetUserID());
      player == undefined ? this.selectedPlayer = null : this.selectedPlayer = player;
    }

    //get life and mana attributes
    if(this.selectedPlayer){
      this.lifeAttribute = this.GetAttribute("Life");
      this.manaAttribute = this.GetAttribute("Mana");
    }

    //get illustration
    this.illustration = await this.games.LoadGameIllustration();

    // Subscribe to files channel
    //console.log("subscribing to files channel")
    this.illustrationUnsubscribe = this.games.client.subscribe('files', response => {
      //console.log('change in files')
      if(response.events.includes('buckets.'+environment.GAMEILLUSTRATION_STORAGE_ID+'.files.*.create')) {
          // Log when a new file is uploaded
          //console.log('change in bucket',response.payload);
          this.illustration = this.games.GetIllustrationUrlPreview((response.payload as any).$id);
      }
    });



  }

  ngOnDestroy(){
    this.games.currentGame = null;
    this.illustrationUnsubscribe();
  }

  GetAttribute(atr:string):GameAttribute{
    return this.selectedPlayer?.attributes.find(x=>x.name==atr)!;
  }


  selectPlayer(player:Player){
    //if this player is already selected, unselect it
    if(this.selectedPlayer == player) this.selectedPlayer = null;
    else if(this.isMJ) this.selectedPlayer = player;
  }


  onNotesChange(event:any){
    //TODO SAVE NOTES
    let content = event.target.value;
    console.log("notes changed: "+content);
  }

  UrlForImage(image:File):SafeUrl{
    let url = URL.createObjectURL(image);
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  onAddQuickImage(event:any){
    if(event.target.files[0]){
      let file = event.target.files[0];
      let url = this.UrlForImage(file);
      this.quickImages.push({file:file,url:url});
    }
  }

  async onQuickImageClick(event:any,img:{file:File;url:SafeUrl}){
    console.log("quick image clicked: "+img.file.name);
    let reponse = await this.games.UploadGameIllustration(img.file);
    this.toast.Show(reponse.value,reponse.type);
  }

  AttributeProgress(attribute:GameAttribute){
    return GetAttributeProgress(attribute);
  }


}
