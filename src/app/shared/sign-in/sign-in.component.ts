import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fadeInOut } from '../animations/fade-in-out'; 
import { SignInService } from '../services/sign-in/sign-in.service';
import { JsonWebToken } from '../models/json-web-token.model';
import { ToastrService } from 'ngx-toastr';
import { Role } from '../models/credentials.model';
import { _UserDetails } from '../models/response.model';

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
  // private userDetails: UserDetails;
  public isSigningIn: boolean = false;

  private userDetails: _UserDetails;

  constructor(private _fb: FormBuilder, private router: Router, private signinService: SignInService, 
    private notify: ToastrService) {
    this.signInForm = _fb.group({
      'email': [null, Validators.email],
      'password': [null, Validators.required]
    });
  }

  ngOnInit() {
  }

  public signIn(form){
    this.isSigningIn = true;
    this.signinService.authenticateUser(form.email, form.password).subscribe(
      (jwt: JsonWebToken)=>{
        localStorage.setItem('userToken', jwt.access_token);

        // this.signinService.sendRequestForUserDetails().subscribe(
        //   (userDetails: UserDetails)=>{
        //     this.isSigningIn = false;
        //     this.setUserDetails(userDetails);
        //     this.routeUser();
        //   }
        // );

        this.signinService.sendRequestForUserDetails().subscribe(
            (userDetails: _UserDetails)=>{
              this.isSigningIn = false;
              this.setUserDetails(userDetails);
              this.routeUser();
            }
          );

      },(error: any) =>{
          this.notify.error(error.error.error_description);
          console.log(error);
          this.isSigningIn = false;
      }
    );  
  }

  // private setUserDetails(userDetails){
  //   this.userDetails = userDetails;
  //   localStorage.setItem('userRole', userDetails.credentials.role);
  // }
  private setUserDetails(userDetails){
    this.userDetails = userDetails;
    localStorage.setItem('userRole', userDetails.role);
  }

  // private isAdmin(): boolean{
  //   if(this.userDetails.credentials.role === Role.ADMIN){
  //     return true;
  //   }
  //   return false;
  // } 

  private isAdmin(): boolean{
    if(this.userDetails.role === Role.ADMIN){
      return true;
    }
    return false;
  } 

  private routeUser(){
    this.isSigningIn = false;
    if(this.isAdmin()){
      this.router.navigate(['dashboard']);
    }else{
      this.router.navigate(['profile']);
    }
    this.notify.success('Welcome: ' +this.userDetails.otherNames+' '+this.userDetails.surname);
  }
}