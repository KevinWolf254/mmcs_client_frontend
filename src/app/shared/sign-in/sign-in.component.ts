import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fadeInOut } from '../animations/fade-in-out'; 
import { SignInService } from '../services/sign-in/sign-in.service';
import { UserDetails } from '../models/user-details.model';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  animations: [
    fadeInOut
  ]
})
export class SignInComponent implements OnInit {

  public signInForm: FormGroup;

  constructor(private _fb: FormBuilder, private router: Router, private signinService: SignInService) {
    this.signInForm = _fb.group({
      'email': [null, Validators.email],
      'password': [null, Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

  ngOnInit() {
  }

  public signIn(form){

    this.signinService.authenticateUser(form.email, form.password).subscribe(
      (successData: any)=>{
        localStorage.setItem('userToken', successData.access_token);
        this.signinService.getUserDetailsFromWebApi().subscribe(
          (userDetails: UserDetails)=>{
            localStorage.setItem('userRole', userDetails.credentials.role);
            if(userDetails.credentials.role == "ROLE_ADMIN"){
              this.router.navigate(['dashboard']);
              // this._toaster.success("Welcome:", "Successfully Signed In");
            }else{
              this.router.navigate(['profile']);            }
          }
        );
    }, error =>{
      if(error.error.status == 401)
        console.log("Unauthorized");
        // this._toaster.error("Wrong username or password", "Access Denied");      
      // this._toaster.error("Something went wrong. Check Connection", "Connection Error");
        console.log("ERROR: "+error);
    });
  }
  
}
