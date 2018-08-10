import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { confirmPasswordValidator } from '../validators/confirm-password-validator';
import { SignInService } from '../services/sign-in/sign-in.service';
import { Employer } from '../models/employer.model';
import { UserService } from '../services/user/user.service';
import { ToastrService } from 'ngx-toastr';
import { _UserDetails } from '../models/response.model';
import { User } from '../models/user.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  public userDetails: _UserDetails = new User();

  public date: string = '';
  public changePassForm: FormGroup;
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
        this.setDateProfile(response);
      }
    );
  }

  private setDateProfile(userDetails: _UserDetails){
    let date = new Date(userDetails.lastSignInDate);
    this.date = "Logged in at: "+date.getHours()+":"+date.getMinutes()+" on "+date.getUTCDate()+
    "-"+date.getMonth()+"-"+date.getFullYear()
    // .toISOString().slice(0,10);
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