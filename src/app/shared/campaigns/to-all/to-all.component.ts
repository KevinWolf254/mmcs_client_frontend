import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CampaignService } from '../../services/campaign/campaign.service';
import { UnitsService } from '../../services/units/units.service';
import { UnitsDetailsResponse } from '../../models/response.model';
import { ClientService } from '../../services/client/client.service';
import { Contacts } from '../../models/client.model';

@Component({
  selector: 'app-to-all',
  templateUrl: './to-all.component.html',
  styleUrls: ['./to-all.component.scss']
})
export class ToAllComponent implements OnInit {
  public form: FormGroup;
  public count: number = 0;
  public isLong: boolean = false;
  public unitsDetails: UnitsDetailsResponse = new UnitsDetailsResponse('', 0, 0);
  public noOfContacts: number = 0;
  public contacts: Contacts;
  constructor(private _fb: FormBuilder, private campaignService: CampaignService, 
    private unitsService: UnitsService, _clientService: ClientService) { 
    this.form = _fb.group({
      'message': ['',Validators.compose([Validators.required, Validators.maxLength(320)])]
    });
  }

  ngOnInit() {
   this.form.get('message').valueChanges.subscribe(
     message => {
       this.count = message.length;
       if(this.count > 160)
        this.isLong = true;
       else
        this.isLong = false;
     }
   );

   this.unitsService.getUnitsAvailable().subscribe(
    (response: UnitsDetailsResponse) => {
      this.unitsDetails = response;
    }
  );
  }
  public getNoOfContacts(){
    this._clientService.getNoOfContacts().subscribe(
      (contacts: Contacts) =>{
        let rwfContacts = contacts.rwfContacts;
        let kesContacts = contacts.kesContacts;
        let tzsContacts = contacts.tzsContacts;
        let ugxContacts = contacts.ugxContacts;
        this.noOfContacts = rwfContacts+kesContacts+tzsContacts+ugxContacts;

        this.contacts = contacts;
      }
    );
  }

  public sendSms(form){
    this.campaignService.sendToAll(form.message, this.count).subscribe(
      response =>{

      }
    );
    this.form.get('message').setValue('');
  }
}
