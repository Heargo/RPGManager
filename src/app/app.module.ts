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
    NewGameComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule 
  ],
  providers: [AuthentificationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
