import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ResponseType } from 'src/app/models/responses';
import { AuthentificationService } from 'src/app/services/auth.services';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  //use router as well

  constructor(private authService:AuthentificationService, private router:Router) { }

  async onLogout() {
    console.log('logout');
    let response = await this.authService.Logout();
    if(response.type == ResponseType.Success){
      this.router.navigate(['/home']);
    }else{
      console.log(response.value);
    }
    

  }
}
