import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.scss']
})
export class UnitsComponent implements OnInit {

  private requestForm: FormGroup;
  private organisation: string;
  private email: string;

  constructor(public activeModal: NgbActiveModal, private _fb: FormBuilder) {
    this.requestForm = _fb.group({
      'units': [null, Validators.required],
      'mpesaTransNo': [null, Validators.required]
    });
   }

  ngOnInit() {
    this.getAdminDetails();
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
    this.organisation = "Aeon-I/O; tech that transends time";
    this.email = "admin@aeon-io.co.ke";
  }

  
}
