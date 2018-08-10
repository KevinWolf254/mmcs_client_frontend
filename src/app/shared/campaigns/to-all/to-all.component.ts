import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CampaignService } from '../../services/campaign/campaign.service';
import { UnitsService } from '../../services/units/units.service';
import { UnitsDetailsResponse } from '../../models/response.model';
import { ClientService } from '../../services/client/client.service';
import { Contacts, Charges } from '../../models/client.model';

@Component({
  selector: 'app-to-all',
  templateUrl: './to-all.component.html',
  styleUrls: ['./to-all.component.scss']
})
export class ToAllComponent implements OnInit {
  public form: FormGroup;
  public messageLength: number = 0;
  public isLong: boolean = false;
  public unitsDetails: UnitsDetailsResponse = new UnitsDetailsResponse('', 0, 0);
  
  public noOfContacts: number = 0;
  public contacts: Contacts;

  public currency: string = "ksh";
  public totalCharges: number = 0.00;
  private basicCharges: number = 0.00;

  public canSend: boolean = true;

  constructor(private _fb: FormBuilder, private campaignService: CampaignService, 
    private unitsService: UnitsService, private _clientService: ClientService) { 
    this.form = _fb.group({
      'message': ['',Validators.compose([Validators.required, Validators.maxLength(320)])]
    });
  }

  ngOnInit() {
    this.form.get('message').valueChanges.subscribe(
      message => {
        this.messageLength = message.length;
        if (this.messageLength > 160) {
          this.isLong = true;
          this.totalCharges = this.basicCharges * 2;
        }else if (this.messageLength > 0 && this.messageLength <= 160){
          this.isLong = false;
          this.totalCharges = this.basicCharges;
        }else{
          this.isLong = false;
          this.totalCharges = 0;
        }
        this.checkSendingValidity();
      }
    );

    this.unitsService.getUnitsAvailable().subscribe(
      (response: UnitsDetailsResponse) => {
        this.setUpCurrency(response);
        this.unitsDetails = response;
      }
    );
    this.getNoOfContacts();
  }

  private getNoOfContacts(){
    this._clientService.getNoOfContacts().subscribe(
      (contacts: Contacts) =>{
        this.contacts = contacts;
        this.noOfContacts = this._clientService.calculateNoOfContacts(contacts);
        this.getCharges();
      }
    );
  }

  private getCharges(){
    this._clientService.getCharges().subscribe(
      (charges: Charges) =>{
        this.basicCharges = this._clientService.calculateCharges(charges, this.contacts);
      }
    );
  }

  private setUpCurrency(unitsDetails: UnitsDetailsResponse) {
    this.currency = this.unitsService.setUpCurrency(unitsDetails);
  }

  public sendSms(form){
    this.campaignService.sendToAll(form.message).subscribe(
      response =>{

      }
    );
    this.form.get('message').setValue('');
    this.totalCharges = 0;
  }

  public checkSendingValidity(){
    if(this.unitsDetails.unitsAvailable > this.totalCharges){      
      this.canSend = true;
    }else if(this.unitsDetails.unitsAvailable < this.totalCharges){
      this.canSend = false;
    }
  }
}
