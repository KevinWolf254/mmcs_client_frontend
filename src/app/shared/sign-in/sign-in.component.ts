import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fadeInOut } from '../animations/fade-in-out'; 
import { SignInService } from '../services/sign-in/sign-in.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  animations: [
    fadeInOut
  ]
})
export class SignInComponent implements OnInit {

  private signInForm: FormGroup;

  constructor(private _fb: FormBuilder, private router: Router, private signinService: SignInService) {
    this.signInForm = _fb.group({
      'email': [null, Validators.email],
      'password': [null, Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

  ngOnInit() {
  }

  signIn(form){
    //send signin info
    //receive access token
    //send request for user role including access token
    //save user role
    //if user role is admin route to dashboard
    //if user role is user, route to my profile
    let role: string = this.signinService.sigin(form.email, form.password).credentials.role;
    if(role == 'admin'){      
      localStorage.setItem('userRole', role);
      this.router.navigate(['dashboard']);
    }else{      
      localStorage.setItem('userRole', role);
      this.router.navigate(['profile']);
    }
  }
}
