import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { fadeInOut } from '../animations/fade-in-out';
import { ToastrService } from 'ngx-toastr';
import { SignUpService } from '../services/sign-up/sign-up.service';
import { Router } from '@angular/router';
import { countryValidator } from '../validators/select-validator';
import { CountryService } from '../services/country/country.service';
import { confirmPasswordValidator } from '../validators/confirm-password-validator';
import { Country } from '../models/employer.model';

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
  public countries = [];

  constructor(private _fb: FormBuilder, private signUpService: SignUpService, private countryService: CountryService,
    private router: Router, private notify: ToastrService) {
    this.signUpForm = _fb.group({
      'surname': [null, Validators.required],
      'otherNames': [null],
      'country':['4', countryValidator],
      'code':['4', countryValidator],
      'phoneNo': [null, Validators.required],
      'organisation': [null, Validators.required],
      'senderId': [null, Validators.compose([Validators.required, Validators.maxLength(11)])],
      'email': [null, Validators.compose([Validators.required, Validators.email])],
      'newPass': [null, Validators.compose([Validators.required, Validators.minLength(6)])],
      'confirm_password': [null, Validators.compose([Validators.required, confirmPasswordValidator])]
    });
  }

  ngOnInit() {
    this.countries = this.countryService.getCountries();
  }

  public signUp(form) {
    let country: string = this.countryService.convertCountryAsString(form.country);    
    let country_code: string = this.countryService.convertCountryAsString(form.code);
    this.isSigningUp = true;
    this.signUpService.registerInClientServer(form.surname, form.otherNames, country, country_code, 
      form.phoneNo, form.organisation, form.email, form.senderId, form.newPass).subscribe(
        (clientServerResponse) => {
          this.notify.success('' + clientServerResponse.message);
          this.isSigningUp = false;
          this.router.navigate(['signin']);
        }, error => {
          this.notify.error('Error: ' + error.error.error_description);
          this.isSigningUp = false;
        }
      );
  }

}
