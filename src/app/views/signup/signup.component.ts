import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthentificationService } from 'src/app/services/auth.services';
import { ResponseType } from 'src/app/models/responses';
import { passwordMatchValidator } from 'src/app/Utils/utils';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy  {

  signupForm!:FormGroup;
  errorMessage:string = "";
  errorInForm:boolean = false;
  formObserver$!:any;

  constructor(private authService:AuthentificationService,private formBuilder: FormBuilder,private router:Router) { }

  async onSubmitForm(){

    if(this.signupForm.value.password != this.signupForm.value.passwordVerification){
      this.errorInForm = true;
      this.errorMessage = "Passwords do not match";
      return;
    }

    let response = await this.authService.CreateAccount(this.signupForm.value.email,this.signupForm.value.password);

    if(response.type == ResponseType.Success){
      this.router.navigate(['/login']);
    }else{
      this.errorInForm = true;
      this.errorMessage = response.value;
    }
  }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      email: [null,[Validators.required,Validators.email]],
      password: [null,[Validators.required,Validators.minLength(8)]],
      passwordVerification: [null,[Validators.required,Validators.minLength(8)]]
    }, passwordMatchValidator);

    //listen to changes in the form and update the error message accordingly
    this.formObserver$ = this.signupForm.valueChanges.subscribe((value) => {
      if(value.password != value.passwordVerification && value.password != null && value.passwordVerification != null){
        this.errorInForm = true;
        this.errorMessage = "Passwords do not match";
      }else{
        this.errorInForm = false;
        this.errorMessage = "";
      }
      console.log("Form changed")
    });
  }

  ngOnDestroy(): void {
    this.formObserver$.unsubscribe();
  }

}
