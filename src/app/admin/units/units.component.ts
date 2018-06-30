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

  private requestForm: FormGroup;
  private organisation: string;
  private email: string;
  private userDetails: UserDetails;

  constructor(public activeModal: NgbActiveModal, private _fb: FormBuilder, private signInService: SignInService) { 
    this.requestForm = _fb.group({
      'units': [null, Validators.required],
      'mpesaTransNo': [null, Validators.required]
    });
   }

  ngOnInit() {
    this.getAdminDetails();
    this.userDetails = this.signInService.getUserDetails();
  }

  /*Send request
  @Param value to get value.units */
  private sendRequest(value){
    let units: number = value.units;
    let mpesaTransNo: string = value.mpesaTransNo;
    // send request
    // @Param units
    // @Param this.mpesaTransNo
    // @Param this.organisation
    // @Param this.email
    console.log("Organisation: "+this.organisation+" Email: "+this.email+
    " mpesaTransNo: "+mpesaTransNo+" Units: "+units);
    
    this.requestForm.reset();
    this.activeModal.close();
  }

  /*Retrieve admin details on bootstrap*/
  private getAdminDetails(){
    this.organisation = this.userDetails.organisation;//"Aeon-I/O; tech that transends time";
    this.email = this.userDetails.email;//"admin@aeon-io.co.ke";
  }

  
}
