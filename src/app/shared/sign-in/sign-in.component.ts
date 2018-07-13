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
  private userDetails: UserDetails;

  constructor(private _fb: FormBuilder, private router: Router, 
    private signinService: SignInService, private notify: ToastrService) {
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
        this.signinService.sendRequestForUserDetails().subscribe(
          (userDetails: UserDetails)=>{
            this.setUserDetails(userDetails);
            this.routeUser();
          }
        ); 
      },error =>{
        if(error.status == '400' || error.status == '401'){
          this.notify.error('The email or password is incorrect');
        }
      }
    );
  }

  private setUserDetails(userDetails){
    this.userDetails = userDetails;
    localStorage.setItem('userRole', userDetails.credentials.role);
    this.signinService.setUserDetails(userDetails);
  }

  private isAdmin(): boolean{
    if(this.userDetails.credentials.role == 'ROLE_ADMIN')
      return true;
    return false
  } 

  private routeUser(){
    if(this.isAdmin()){
      this.router.navigate(['dashboard']);
    }else{
      this.router.navigate(['profile']);
    }
    this.notify.success("Welcome: " +this.userDetails.firstName+' '+this.userDetails.lastName);
  }
}
