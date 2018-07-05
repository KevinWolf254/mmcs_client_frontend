import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { confirmPasswordValidator } from '../validators/confirm-password-validator';
import { User } from '../models/user.model';
import { UserCredentials } from '../models/user-credentials.model';
import { SignInService } from '../services/sign-in/sign-in.service';
import { UserDetails } from '../models/user-details.model';
import { Employer } from '../models/employer.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  employer: Employer= {id: 0, name: ''};
  userDetails: UserDetails = new UserDetails(0,'','','','',false,new Date(), this.employer);
  lastSignIn: Date = new Date();
  date=''
  changePassForm: FormGroup;

  constructor(private _fb: FormBuilder, private signInService: SignInService) { 
    this.changePassForm = _fb.group({
      'currentPass': [null, Validators.required],
      'newPass': [null,Validators.compose([Validators.required, Validators.minLength(8)])],
      'confirmNewPass': [null,Validators.compose([Validators.required, confirmPasswordValidator])]
    });

    this.changePassForm.controls.newPass.valueChanges
    .subscribe(
      password => this.changePassForm.controls.confirmNewPass.updateValueAndValidity()
    );
  } 

  ngOnInit() {
    this.getUserProfile();
  }

  private getUserProfile(){
    this.userDetails = this.signInService.getSignedInUserDetails();
    this.lastSignIn = this.userDetails.credentials.lastSignIn;
    let date = new Date();
    this.date = date.toISOString().slice(0,10);

    // this.signInService.getUserDetailsFromWebApi().subscribe(
    //   (userDetails: UserDetails) =>{
    //     this.userDetails = userDetails;
    //     let date = new Date();
    //     this.lastSignIn = userDetails.credentials.lastSignIn;
    //     this.date = date.toISOString().slice(0,10);
    //     console.log('Last Sign In: '+this.lastSignIn);
    //   },(error)=>{
    //     console.log('ERROR: '+error)
    //   }
    // );
  }

  changePassword(values){
    this.signInService.changePassword(values.currentPass, values.newPass);
    this.changePassForm.reset(); 
  } 
}