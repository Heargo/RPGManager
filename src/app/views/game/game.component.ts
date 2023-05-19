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
  filesChangesUnsubscribe!:any;
  playerChangesUnsubscribe!:any;
  playerAttributesChangesUnsubscribe!:any;
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

    console.log("players",this.playerList)

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

    this.SubscribeToEvents()

  }

  ngOnDestroy(){
    this.filesChangesUnsubscribe();
    this.playerChangesUnsubscribe();
    this.playerAttributesChangesUnsubscribe();
  }

  SubscribeToEvents(){
    // Subscribe to files changes
    this.filesChangesUnsubscribe = this.games.client.subscribe('files', response => {
      if(response.events.includes('buckets.'+environment.GAMEILLUSTRATION_STORAGE_ID+'.files.*.create')) {
          this.illustration = this.games.GetIllustrationUrlPreview((response.payload as any).$id);
      }
    });

    let subUrlBase = 'databases.'+environment.DATABASE_ID+'.collections.';

    //subscribe to player changes
    this.playerChangesUnsubscribe = this.players.client.subscribe(subUrlBase+environment.PLAYER_COLLECTION_ID+".documents", async response => {
      let player = this.players.MapAnyToPlayer(response.payload as any);

      if(player.gameID != this.game?.id) return;
  
      if(response.events.includes('documents.delete')){
        this.toast.Show(player.name+" has left the game",ResponseType.Warning);
        if(player.id == this.selectedPlayer?.id)
          this.UpdateCurrentPlayer(player,true)

        this.UpdatePlayersList(response.payload as Player,true);
      }
      else{
        //load player inventory
        player.inventory = await this.players.LoadPlayerInventory(player.id);

        if(player.id == this.selectedPlayer?.id)
          this.UpdateCurrentPlayer(player)

        this.UpdatePlayersList(player);

      }
    });

    //subscribe to player attributes changes
    this.playerAttributesChangesUnsubscribe = this.players.client.subscribe(subUrlBase+environment.PLAYERATTRIBUTES_COLLECTION_ID+".documents", response => {
      
      let attribute = response.payload as any; //this.players.FormatAttributes([response.payload as any])[0];
      //if document not related to a player, ignore
      let attributeOwnerIndex = this.playerList.findIndex(p => p.attributes.find(a => a.id == attribute.$id) != undefined);
      if(attributeOwnerIndex == -1) return;
      
      //update player attribute
      let attributeToUpdateIndex =this.playerList[attributeOwnerIndex].attributes.find(a => a.id == attribute.$id);
      if(attributeToUpdateIndex != undefined){
        attributeToUpdateIndex.valueAddition = attribute.valueAddition;
        attributeToUpdateIndex.value = attribute.value;
      }


    });
  }

  UpdateCurrentPlayer(player:Player,remove:boolean = false){
    if(remove) this.selectedPlayer = null;
    else{  
      this.selectedPlayer = player;
      this.lifeAttribute = this.GetAttribute("Life");
      this.manaAttribute = this.GetAttribute("Mana");
    }
  }

  UpdatePlayersList(player:Player,remove:boolean=false){
    let index = this.playerList.findIndex(p => p.id == player.id);

    if(index != -1){
      if(remove) this.playerList.splice(index,1);
      else this.playerList[index] = player;
    }
    else{
      this.playerList.push(player);
    }
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
    let reponse = await this.games.UploadGameIllustration(img.file);
    this.toast.Show(reponse.value,reponse.type);
  }

  AttributeProgress(attribute:GameAttribute){
    return GetAttributeProgress(attribute);
  }


}
