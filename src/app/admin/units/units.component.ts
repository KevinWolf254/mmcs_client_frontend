import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SignInService } from '../../shared/services/sign-in/sign-in.service';
import { UnitsService } from '../../shared/services/units/units.service';
import { ToastrService } from 'ngx-toastr';
import { UnitsResponseSuccess, _UserDetails } from '../../shared/models/response.model';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.scss']
})
export class UnitsComponent implements OnInit {

  public requestForm: FormGroup; 

  // public userDetails: UserDetails = new UserDetails(0, '', '', '', '', 
  // false, new Date(), this.employer);
  public userDetails: _UserDetails = new User();

  constructor(public activeModal: NgbActiveModal, private _fb: FormBuilder, 
    private signInService: SignInService, private unitsService: UnitsService, 
    private notify: ToastrService) { 
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
  
  public requestMoreUnits(form){
    this.unitsService.addUnits(form.units, form.mpesaTransNo).subscribe(
      (response: UnitsResponseSuccess) =>{
        console.log(response);
        this.notify.success(response.message, response.title);
        this.requestForm.reset();
        this.activeModal.close();
      }, error =>{
        this.notify.error(error.error.error_description, error.error.error);
      }
    );
  } 
}
