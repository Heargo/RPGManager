import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthentificationService } from 'src/app/services/auth.services';
import { ResponseType } from 'src/app/models/responses';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!:FormGroup;
  errorMessage:string = "";
  errorInForm:boolean = false;

  constructor(private authService:AuthentificationService,private formBuilder: FormBuilder,private router:Router) { }

  async onSubmitForm(){
    
    let response = await this.authService.Login(this.loginForm.value.email,this.loginForm.value.password);
   
    if(response.type == ResponseType.Success){
      this.router.navigate(['/games']);
    }else{
      this.errorInForm = true;
      this.errorMessage = response.value;
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null,[Validators.required,Validators.email]],
      password: [null,[Validators.required,Validators.minLength(8)]],
    });
  }

}
