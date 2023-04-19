import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePlayerComponent } from './views/create-player/create-player.component';
import { GameComponent } from './views/game/game.component';
import { GamesComponent } from './views/games/games.component';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
import { NewGameComponent } from './views/new-game/new-game.component';
import { SettingsComponent } from './views/settings/settings.component';
import { SignupComponent } from './views/signup/signup.component';
import { ItemsComponent } from './views/items/items.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'games', component:GamesComponent },
  { path: 'game', component:GameComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'new-game', component: NewGameComponent },
  { path: 'create-player', component: CreatePlayerComponent },
  { path: 'items', component: ItemsComponent},
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
