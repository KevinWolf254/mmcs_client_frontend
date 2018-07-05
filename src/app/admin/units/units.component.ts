import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserDetails } from '../../shared/models/user-details.model';
import { SignInService } from '../../shared/services/sign-in/sign-in.service';
import { UnitsService } from '../../shared/services/units/units.service';
import { Employer } from '../../shared/models/employer.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.scss']
})
export class UnitsComponent implements OnInit {

  public requestForm: FormGroup; 
  private employer: Employer = new Employer();
  public userDetails: UserDetails = new UserDetails(0, '', '', '', '', false, new Date(), this.employer);

  constructor(public activeModal: NgbActiveModal, private _fb: FormBuilder, private signInService: SignInService, 
    private unitsService: UnitsService, private notify: ToastrService) { 
    this.requestForm = _fb.group({
      'units': [null, Validators.required],
      'mpesaTransNo': [null, Validators.required]
    });
   }

  ngOnInit() {
    this.signInService.sendRequestForUserDetails().subscribe(
      userDetails =>{ 
        this.userDetails = userDetails;
      }
    );
  }
  
  public sendRequestForMoreUnits(form){
    this.unitsService.sendRequestForUnitsToClientWebApi(this.userDetails, form.units, form.mpesaTransNo).subscribe(
      response =>{
        this.notify.success('Request sent successfully.');
        this.requestForm.reset();
        this.activeModal.close();
      }, error =>{
        this.notify.error('Something wrong happened!');
      }
    );
  }  
}
