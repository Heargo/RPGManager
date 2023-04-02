import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthentificationService } from 'src/app/services/auth.services';
import { ResponseType } from 'src/app/models/responses';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy  {

  loginForm!:FormGroup;
  errorMessage:string = "";
  errorInForm:boolean = false;
  formObserver$!:any;

  constructor(private authService:AuthentificationService,private formBuilder: FormBuilder) { }

  async onSubmitForm(){

    if(this.loginForm.value.password != this.loginForm.value.passwordVerification){
      this.errorInForm = true;
      this.errorMessage = "Passwords do not match";
      return;
    }

    let response = await this.authService.CreateAccount(this.loginForm.value.email,this.loginForm.value.password);
    this.errorInForm = (response.type == ResponseType.Error);
    this.errorMessage = response.value;
  }

  validForm(){
    let valid = true;
    for(let key in this.loginForm.value){
      if(this.loginForm.value[key] == null || this.loginForm.value[key] == ""){
        valid = false;
      }
    }
    return valid && this.loginForm.value.password === this.loginForm.value.passwordVerification ;
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null],
      password: [null],
      passwordVerification: [null]
    });

    //listen to changes in the form and update the error message accordingly
    this.formObserver$ = this.loginForm.valueChanges.subscribe((value) => {
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
