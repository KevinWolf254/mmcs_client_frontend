import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { confirmPasswordValidator } from '../validators/confirm-password-validator';
import { User } from '../models/user.model';
import { UserCredentials } from '../models/user-credentials.model';
import { SignInService } from '../services/sign-in/sign-in.service';
import { UserDetails } from '../models/user-details.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  userDetails: UserDetails;
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

  getUserProfile(){
    this.userDetails = this.signInService.getUserDetails();
  }

  changePassword(values){
    this.signInService.changePassword(values.currentPass, values.newPass);
    this.changePassForm.reset();
  } 
}