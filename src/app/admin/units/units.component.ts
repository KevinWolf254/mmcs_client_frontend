import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserDetails } from '../../shared/models/user-details.model';
import { SignInService } from '../../shared/services/sign-in/sign-in.service';
import { UnitsService } from '../../shared/services/units/units.service';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.scss']
})
export class UnitsComponent implements OnInit {

  requestForm: FormGroup;
  userDetails: UserDetails;

  constructor(public activeModal: NgbActiveModal, private _fb: FormBuilder, private signInService: SignInService, private unitsService: UnitsService) { 
    this.requestForm = _fb.group({
      'units': [null, Validators.required],
      'mpesaTransNo': [null, Validators.required]
    });
   }

  ngOnInit() {
    this.userDetails = this.signInService.getUserDetails();
  }

  /*Send request
  @Param value to get value.units */
  sendRequest(value){
    this.unitsService.sendRequestForUnitsToClientWebApi(this.userDetails, value.units, value.mpesaTransNo);
    this.requestForm.reset();
    this.activeModal.close();
  }  
}
