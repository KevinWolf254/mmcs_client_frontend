import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { fadeInOut } from '../animations/fade-in-out';
import { ToastrService } from 'ngx-toastr';
import { SignUpService } from '../services/sign-up/sign-up.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  animations: [
    fadeInOut
  ]
})
export class SignUpComponent implements OnInit {

  public signUpForm: FormGroup;
  public isSigningUp: boolean = false;

  constructor(private _fb: FormBuilder, private signUpService: SignUpService, private router: Router, 
    private notify: ToastrService) {
    this.signUpForm = _fb.group({
      'surname': [null],
      'otherNames': [null],
      'organisation': [null, Validators.required],
      'email': [null, Validators.compose([Validators.required, Validators.email])],
      'password': [null, Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

  ngOnInit() {
  }

  public signUp(form) {
    this.isSigningUp = true;
    this.signUpService.registerInAeonServer(form.email, form.organisation).subscribe(
      (aeonServerResponse) => {
        this.signUpService.registerInClientServer(form.surname, form.otherNames, form.email,
          aeonServerResponse.organisation.id, aeonServerResponse.organisation.name, form.password).subscribe(
            (clientServerResponse) => {
              this.notify.success(''+clientServerResponse.message);
              this.isSigningUp = false;
              this.router.navigate(['signin']);
            }, error => {
                this.notify.error('Error: '+error.error.message);
                this.isSigningUp = false;
            }
          );
      }, error => {
          this.notify.error('Error: '+error.error.message);
          this.isSigningUp = false;
      }
    );
  }

}
