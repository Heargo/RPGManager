import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthentificationService } from 'src/app/services/auth.services';
import { ResponseType } from 'src/app/models/responses';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!:FormGroup;
  errorMessage:string = "";
  errorInForm:boolean = false;

  constructor(private authService:AuthentificationService,private formBuilder: FormBuilder) { }

  async onSubmitForm(){
    
    let response = await this.authService.CreateAccount(this.loginForm.value.email,this.loginForm.value.password);
    this.errorInForm = (response.type == ResponseType.Error);
    this.errorMessage = response.value;
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null],
      password: [null]
    });
  }

}
