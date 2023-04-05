import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { HomeComponent } from './views/home/home.component';
import { AttributionsComponent } from './views/attributions/attributions.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './views/login/login.component';
import { SignupComponent } from './views/signup/signup.component';
import { FooterComponent } from './components/footer/footer.component';
import { GamesComponent } from './views/games/games.component';
import { SettingsComponent } from './views/settings/settings.component';

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
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
