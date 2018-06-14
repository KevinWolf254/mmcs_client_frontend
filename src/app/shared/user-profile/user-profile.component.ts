import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { confirmPasswordValidator } from '../validators/confirm-password-validator';
import { User } from '../models/user.model';
import { UserCredentials } from '../models/user-credentials.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  // private user: User = new User();
  private user: UserCredentials;
  private changePassForm: FormGroup;

  constructor(private _fb: FormBuilder) { 
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
    //retrieve user information 
    this.user = new UserCredentials(1, 'Kanyi', 'JavaGuru', 'admin@aeon-io.co.ke', 'Admin', true, new Date());
    // this.user.credentials.active = true;
    // this.user.credentials.lastSignIn = new Date();
  }

  changePassword(values){
    // save new password
    console.log("current pass: "+values.currentPass+
    " new Pass: "+values.newPass+" confirm pass: "+values.confirmNewPass);
    this.changePassForm.reset();
  } 
}