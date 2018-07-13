import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { fadeInOut } from '../animations/fade-in-out';
import { ToastrService } from 'ngx-toastr';

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

  constructor(private _fb: FormBuilder, private notify: ToastrService) {
    this.signUpForm = _fb.group({
      'surname': [null],
      'othernames': [null],
      'organisation': [null, Validators.required],
      'email': [null, Validators.compose([Validators.required, Validators.email])],
      'password': [null, Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

  ngOnInit() {
  }

  public signUp(form) {
    // this.signUpService.registerInAeonServer(form.email, form.organisation).subscribe(
    //   (aeonServerResponse) => {
    //     this.signUpService.registerInClientServer(form.surname, form.otherNames, form.email,
    //       aeonServerResponse.organisation.id, aeonServerResponse.organisation.name, form.password).subscribe(
    //         (clientServerResponse) => {
    //           //notify of successful registration
    //           this.notify.success(''+clientServerResponse.message);
    //           this.routeToSignIn();
    //         }
    //       );
    //   }, error => {
    //     if (error.status == '400' || error.status == '401') {
    //       this.notify.error('Error: '+error.message);
    //     }
    //   }
    // );
  }

}
