import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Group } from '../../models/group.model';
import { selectValidator } from '../../validators/select-validator';
import { GroupManagerService } from '../../services/group/group-manager.service';
import { SmsToGroup, Sms } from '../../models/sms.model';
import { Contacts, Charges } from '../../models/client.model';
import { UnitsService } from '../../services/units/units.service';
import { UnitsDetailsResponse } from '../../models/response.model';
import { ClientService } from '../../services/client/client.service';
import { NoSchedule } from '../../models/schedule.model';
import { CampaignService } from '../../services/campaign/campaign.service';
import { ToastrService } from '../../../../../node_modules/ngx-toastr';

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
  public selectedRecipients: Group[] = [];

  public recipientsIds: number[] = [];  
  public form: FormGroup;
  
  public isSendingSms: boolean = false;

  constructor(private _fb: FormBuilder, private unitsService: UnitsService, 
    private groupService: GroupManagerService, private _clientService: ClientService,
    private campaignService: CampaignService, private notify: ToastrService) {

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

    //get details on units available and setup the currency
    this.unitsService.getUnitsAvailable().subscribe(
      (response: UnitsDetailsResponse) => {
        this.setUpCurrency(response);
        this.unitsDetails = response;
      }
    );

    //observes the changes in the message textfield
    this.monitorCharges();
  }   

  private monitorCharges() {
    this.form.get('message').valueChanges.subscribe(message => {
      if(this.form.get('message').touched && this.form.get('message').valid)
        this.messageLength = message.length;
      this.changeCharges(message);
      
    });
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

  public addGroup() {
    //find group with selected id
    let group: Group = this.groupService.findGroup(this.groups, this.selected);
    //check if recipients has a group of recipients added to it
    if (this.selectedRecipients.length != 0) {
      //check and remove duplicates
      this.selectedRecipients = this.removeDuplicate();
      this.recipientsIds = this.removeIdsDuplicate();

    }
    this.selectedRecipients.push(group);
    this.recipientsIds.push(group.id);

    this.getNoOfContactsByGroup(this.recipientsIds);
    //reset select
    this.form.get('group').setValue('0');
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
        if(this.form.get('message').touched && this.form.get('message').valid){
          let message = this.form.get('message').value;
          //calculate charges
          this.changeCharges(message);
        }
      }
    );
  }

  private changeCharges(message: any) {
    this.messageLength = message.length;
    if (this.messageLength > 160 && this.recipientsIds.length != 0) {
      this.isLong = true;
      this.totalCharges = this.basicCharges * 2;
    }
    else if (this.messageLength > 0 && this.messageLength <= 160 && this.recipientsIds.length != 0) {
      this.isLong = false;
      this.totalCharges = this.basicCharges;
    }
    else {
      this.isLong = false;
      this.totalCharges = 0;
    }
    this.checkSendingValidity();
  }

  private removeIdsDuplicate(): number[]{
    return this.recipientsIds = this.recipientsIds.filter((id: number)=>{
        return id != this.selected;
    });
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

  public sendSms(form){
    this.isSendingSms = true;
    let sms: Sms = new SmsToGroup(form.message, new NoSchedule, this.recipientsIds);
    this.campaignService.sendNonScheduledSms(sms).subscribe(
      response =>{
        this.isSendingSms = false;
        this.notify.success(response.message, response.title);
        //reset form and select_Groups array
        this.resetDataValues();
        this.resetForm();
      }, error =>{
        this.isSendingSms = false;
        this.notify.error(error.error.error_description, error.error.error);
      }
    );
  }
   
  private resetForm(){
    this.form.get('message').setValue('');
    this.form.get('group').setValue('0');
  }

  private resetDataValues(){
    this.selectedRecipients = [];
    this.recipientsIds = [];
    this.noOfContacts = 0;
  }
}
