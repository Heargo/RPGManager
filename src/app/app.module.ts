import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { HomeComponent } from './views/home/home.component';
import { AttributionsComponent } from './views/attributions/attributions.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './views/login/login.component';
import { SignupComponent } from './views/signup/signup.component';
import { FooterComponent } from './components/footer/footer.component';
import { GamesComponent } from './views/games/games.component';
import { SettingsComponent } from './views/settings/settings.component';
import { AuthentificationService } from './services/auth.services';
import { GamePreviewComponent } from './components/game-preview/game-preview.component';
import { NewGameComponent } from './views/new-game/new-game.component';
import { ToastComponent } from './components/toast/toast.component';
import { CreatePlayerComponent } from './views/create-player/create-player.component';
import { GameComponent } from './views/game/game.component';
import { LoadingComponent } from './components/loading/loading.component';
import { PlayerPreviewComponent } from './components/player-preview/player-preview.component';
import { PlayerDetailsComponent } from './components/player-details/player-details.component';
import { DiceComponent } from './components/dice/dice.component';
import { ItemsComponent } from './views/items/items.component';
import { CreateItemComponent } from './views/create-item/create-item.component';
import { DropDownComponent } from './components/drop-down/drop-down.component';
import { ItemPreviewComponent } from './components/item-preview/item-preview.component';
import { RarityIconComponent } from './components/rarity-icon/rarity-icon.component';
import { ItemSmallPreviewComponent } from './components/item-small-preview/item-small-preview.component';
import { ContactComponent } from './views/contact/contact.component';
import { HttpClientModule } from '@angular/common/http';
import { PrivacyPolicyComponent } from './views/privacy-policy/privacy-policy.component';
import { ContextMenuComponent } from './components/context-menu/context-menu.component';
import { ToolsComponent } from './views/tools/tools.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomeComponent,
    AttributionsComponent,
    LoginComponent,
    SignupComponent,
    FooterComponent,
    GamesComponent,
    SettingsComponent,
    GamePreviewComponent,
    NewGameComponent,
    ToastComponent,
    CreatePlayerComponent,
    GameComponent,
    LoadingComponent,
    PlayerPreviewComponent,
    PlayerDetailsComponent,
    DiceComponent,
    ItemsComponent,
    CreateItemComponent,
    DropDownComponent,
    ItemPreviewComponent,
    RarityIconComponent,
    ItemSmallPreviewComponent,
    ContactComponent,
    PrivacyPolicyComponent,
    ContextMenuComponent,
    ToolsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [AuthentificationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
