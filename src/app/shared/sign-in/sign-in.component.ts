import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fadeInOut } from '../animations/fade-in-out'; 
import { SignInService } from '../services/sign-in/sign-in.service';
import { UserDetails } from '../models/user-details.model';
import { JsonWebToken } from '../models/json-web-token.model';
import { ToastrService } from 'ngx-toastr';
import { EmployerRegistration } from '../models/employer.model';
import { AeonService } from '../services/aeon/aeon.service';
import { SignUpService } from '../services/sign-up/sign-up.service';
import { Role } from '../navigation/side-navbar/side-navbar.component';

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
  public isSigningIn: boolean = false;

  constructor(private _fb: FormBuilder, private router: Router, private aeonService: AeonService,
    private signinService: SignInService, private notify: ToastrService) {
    this.signInForm = _fb.group({
      'email': [null, Validators.email],
      'password': [null, Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

  ngOnInit() {
  }

  public signIn(form){
    this.confirmIsRegistered(form.email, form.password);   
  }

  private confirmIsRegistered(email: string, password: string){
    this.aeonService.confirmRegisteration(email).subscribe(
      (response: EmployerRegistration) =>{
        console.log(response.enabled);
        if(!response.enabled){          
          this.notify.error('Account has not been activated. Please activate your account. Link was sent to your email address provided during registration.');
        }else
          this.authenticateUser(email, password);          
        this.isSigningIn = false;
      },error =>{
        if(error.status == '400' || error.status == '401'){
          this.notify.error('The email or password is incorrect 01');
        }
        console.log(error);
        this.notify.error('The email or password is incorrect 02');
        this.isSigningIn = false;
      }
    );
  }

  private authenticateUser(email: string, password: string){
    this.isSigningIn = true;
    this.signinService.authenticateUser(email, password).subscribe(
      (jwt: JsonWebToken)=>{
        localStorage.setItem('userToken', jwt.access_token);        
        this.signinService.sendRequestForUserDetails().subscribe(
          (userDetails: UserDetails)=>{
            this.isSigningIn = false;
            this.setUserDetails(userDetails);
            this.routeUser();
          }
        ); 
      },error =>{
        if(error.status == '400' || error.status == '401'){
          this.notify.error('The email or password is incorrect 03');
        }
        this.isSigningIn = false;
      }
    );
  }

  private setUserDetails(userDetails){
    this.userDetails = userDetails;
    localStorage.setItem('userRole', userDetails.credentials.role);
  }

  private isAdmin(): boolean{
    if(this.userDetails.credentials.role === Role.ADMIN){
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
    this.notify.success("Welcome: " +this.userDetails.surname+' '+this.userDetails.otherNames);
  }
}
