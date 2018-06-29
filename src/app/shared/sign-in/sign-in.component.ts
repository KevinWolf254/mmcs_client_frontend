import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fadeInOut } from '../animations/fade-in-out';
import { slideLeftRight } from '../animations/slide-left-right';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  animations: [
    fadeInOut,
    slideLeftRight
  ]
})
export class SignInComponent implements OnInit {

  private signInForm: FormGroup;

  private admin = {email:"admin@aeon-tech.co.ke", password: "admin123", role: "admin"};
  private user = {email:"user@aeon-tech.co.ke", password: "user123", role: "user"};

  constructor(private _fb: FormBuilder, private router: Router) {
    this.signInForm = _fb.group({
      'email': [null, Validators.email],
      'password': [null, Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

  ngOnInit() {
  }

  signIn(form){
    console.log("Email: "+form.email);
    console.log("Password: "+form.password);
    //send signin info
    //receive access token
    //send request for user role including access token
    //save user role
    //if user role is admin route to dashboard
    //if user role is user, route to my profile
    if(form.email == this.admin.email && form.password == this.admin.password){
      localStorage.setItem('userRole', this.admin.role);
      this.router.navigate(['dashboard']);
    }else if(form.email == this.user.email && form.password == this.user.password){
      localStorage.setItem('userRole', this.user.role);
      this.router.navigate(['profile']);
    }
  }

}
