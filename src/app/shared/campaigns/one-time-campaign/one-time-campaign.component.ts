import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Group } from '../../models/group.model';
import { selectValidator } from '../../validators/select-validator';
import { GroupManagerService } from '../../services/group/group-manager.service';
import { SmsToGroup } from '../../models/sms.model';
import { Contacts, Charges } from '../../models/client.model';
import { UnitsService } from '../../services/units/units.service';
import { UnitsDetailsResponse } from '../../models/response.model';
import { ClientService } from '../../services/client/client.service';

@Component({
  selector: 'app-one-time-campaign',
  templateUrl: './one-time-campaign.component.html',
  styleUrls: ['./one-time-campaign.component.scss']
})
export class OneTimeCampaignComponent implements OnInit{

  public unitsDetails: UnitsDetailsResponse = new UnitsDetailsResponse('', 0, 0);
  public noOfContacts: number = 0;
  public contacts: Contacts;
  public isLong: boolean = false;

  public currency: string = "ksh";
  public totalCharges: number = 0.00;
  private basicCharges: number = 0.00;
  
  public messageLength: number = 0;
  public canSend: boolean = true;

  public selected = 0;
  public groups: Group[] = [];
  selectedRecipients: Group[] = [];

  recipientsIds: number[] = [];  
  public form: FormGroup;

  constructor(private _fb: FormBuilder, private unitsService: UnitsService, 
    private groupService: GroupManagerService, private _clientService: ClientService) {
    this.form = _fb.group({
      'message': [null,Validators.compose([Validators.required, Validators.maxLength(320)])],
      'group': ['0', selectValidator]
    });
  }

  ngOnInit() {
    // retrieve groups for organisation from API
    this.groupService.getGroups().subscribe(
      (groups: Group[]) =>{
        this.groups = groups;
      }
    );
    
    //observes the changes in the message textfield
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

    //get details on units available and setup the currency
    this.unitsService.getUnitsAvailable().subscribe(
      (response: UnitsDetailsResponse) => {
        this.setUpCurrency(response);
        this.unitsDetails = response;
      }
    );
  }   

  private setUpCurrency(unitsDetails: UnitsDetailsResponse) {
    this.currency = this.unitsService.setUpCurrency(unitsDetails);
  }

  public checkSendingValidity(){
    if(this.unitsDetails.unitsAvailable > this.totalCharges){      
      this.canSend = true;
    }else if(this.unitsDetails.unitsAvailable < this.totalCharges){
      this.canSend = false;
    }
  }

  public addGroup(){
    //find group with selected id
    let group: Group = this.groupService.findGroup(this.groups, this.selected);
    //check if recipients has a group of recipients added to it
    if(this.selectedRecipients.length !=0){
        //check and remove duplicates
        this.selectedRecipients = this.removeDuplicate();
    }
    this.selectedRecipients.push(group);

    //push the group id to the array of ids 
    this.selectedRecipients.forEach((group, index)=>{
      this.recipientsIds.push(group.id);
    });

    this.getNoOfContactsByGroup(this.recipientsIds);
  }
  
private getNoOfContactsByGroup(recipientsIds: number[]){
  this._clientService.getNoOfContactsByGroup(recipientsIds).subscribe(
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

  private removeDuplicate(): Group[]{
    return this.selectedRecipients = this.selectedRecipients.filter((group: Group)=>{
        return group.id != this.selected;
    });
  }

  /**removes group from array of selected groups */
  public remove(removeGroup: Group){
    this.selectedRecipients.forEach((group, index)=>{
      if(group.id == removeGroup.id){
        this.selectedRecipients.splice(index, 1);
      }
    });
    //remove from recipientsIds/groupIds
    this.recipientsIds.forEach((id, index)=>{
      if(id == removeGroup.id){
        this.recipientsIds.splice(index, 1);
      }
    })
    this.getNoOfContactsByGroup(this.recipientsIds);
  } 

  sendSms(formValues){
    this.selectedRecipients.forEach((group, index)=>{
      this.recipientsIds.push(group.id);
    });
    // let sms = new SmsGroup(formValues.message, this.recipientsIds);
    //reset form and selectedGroups array
    this.resetForm();
    this.resetDataValues();
  }
   
  resetForm(){
    this.form.reset();
    this.form.get("group").setValue(0);
  }

  resetDataValues(){
    this.selectedRecipients = [];
    this.recipientsIds = [];
  }
}
