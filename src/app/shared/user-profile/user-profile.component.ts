import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { confirmPasswordValidator } from '../validators/confirm-password-validator';
import { User, UserDetails } from '../models/user.model';
import { SignInService } from '../services/sign-in/sign-in.service';
import { Employer } from '../models/employer.model';
import { UserService } from '../services/user/user.service';
import { ToastrService } from 'ngx-toastr';
import { _UserDetails } from '../models/response.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  employer: Employer= {id: 0, name: ''};
  // userDetails: UserDetails = new UserDetails(0,'','','','',false,new Date(), this.employer);
  userDetails: _UserDetails;

  lastSignIn: Date = new Date();
  date=''
  changePassForm: FormGroup;
  public changingPass: boolean = false;

  constructor(private _fb: FormBuilder, private signInService: SignInService, private userService: UserService,
    private notify: ToastrService) { 
    this.changePassForm = _fb.group({
      'newPass': [null,Validators.compose([Validators.required, Validators.minLength(8)])],
      'confirmNewPass': [null,Validators.compose([Validators.required, confirmPasswordValidator])]
    });

    this.changePassForm.controls.newPass.valueChanges
    .subscribe(
      password => this.changePassForm.controls.confirmNewPass.updateValueAndValidity()
    );
  } 

  ngOnInit() {
    this.signInService.sendRequestForUserDetails().subscribe(
      (response: _UserDetails)=>{
        this.userDetails = response;
      }
    );
    this.setDateProfile();
  }

  private setDateProfile(){
    this.lastSignIn = this.userDetails.lastSignInDate;
    let date = new Date(this.lastSignIn);
    this.date = date.toISOString().slice(0,10);
  }

  changePassword(form){
    this.changingPass = true;
    this.userService.changePassword(form.newPass).subscribe(
      (response: any)=>{  
        this.changingPass = false; 
        this.notify.success('Password was successfully changed..');   
        this.changePassForm.reset(); 
      },errror =>{        
        this.changingPass = false; 
        this.notify.error('Something wrong happened..'); 
      }
    );
  } 
}