import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fadeInOut } from '../animations/fade-in-out'; 
import { SignInService } from '../services/sign-in/sign-in.service';
import { UserDetails } from '../models/user-details.model';
import { JsonWebToken } from '../models/json-web-token.model';
import { ToastrService } from 'ngx-toastr';

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

  constructor(private _fb: FormBuilder, private router: Router, private signinService: SignInService, private notify: ToastrService) {
    this.signInForm = _fb.group({
      'email': [null, Validators.email],
      'password': [null, Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

  ngOnInit() {
  }

  public signIn(form){
    this.signinService.authenticateUser(form.email, form.password).subscribe(
      (jwt: JsonWebToken)=>{
        localStorage.setItem('userToken', jwt.access_token);
        if(this.isAdmin){
          this.router.navigate(['dashboard']);
        }else{
          this.router.navigate(['profile']);
        }
        this.notify.success("Welcome: " +this.signinService.getSignedInUserDetails().firstName+' '+
        this.signinService.getSignedInUserDetails().lastName);

        // this.signinService.getUserDetails().subscribe(
        //   (userDetails: UserDetails)=>{
        //     localStorage.setItem('userRole', userDetails.credentials.role);
        //     if(userDetails.credentials.role == "ROLE_ADMIN"){
        //       this.router.navigate(['dashboard']);
        //       this.notify.success("Welcome: " +userDetails.firstName+' '+userDetails.lastName);
        //     }else{
        //       this.router.navigate(['profile']);
        //     }
        //   }
        // );

      },error =>{
        if(error.status == '400' || error.status == '401'){
          this.notify.error('The email or password is incorrect');
        }
      }
    );
  }

  private isAdmin(): boolean{
    if(this.signinService.getSignedInUserDetails().credentials.role == 'ROLE_ADMIN')
      return true;
    return false
  }
  
}
