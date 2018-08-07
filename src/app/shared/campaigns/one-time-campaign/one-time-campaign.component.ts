import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Group } from '../../models/group.model';
import { selectValidator } from '../../validators/select-validator';
import { GroupManagerService } from '../../services/group/group-manager.service';
import { SmsToGroup } from '../../models/sms.model';
import { Contacts } from '../../models/client.model';
import { UnitsService } from '../../services/units/units.service';
import { UnitsDetailsResponse } from '../../models/response.model';

@Component({
  selector: 'app-one-time-campaign',
  templateUrl: './one-time-campaign.component.html',
  styleUrls: ['./one-time-campaign.component.scss']
})
export class OneTimeCampaignComponent implements OnInit{

  public unitsDetails: UnitsDetailsResponse = new UnitsDetailsResponse('', 0, 0);
  public noOfContacts: number = 0;
  public contacts: Contacts;

  public currency: string = "ksh";
  public totalCharges: number = 0.00;
  private basicCharges: number = 0.00;
  
  public messageLength: number = 0;

  public canSend: boolean = true;

  message_characters = 0;
  selected = 0;
  groups: Group[] = [];
  selectedRecipients: Group[] = [];

  recipientsIds: number[] = [];  
  form: FormGroup;

  constructor(private _fb: FormBuilder, private unitsService: UnitsService, 
    private groupService: GroupManagerService) {
    this.form = _fb.group({
      'message': [null,Validators.compose([Validators.required, Validators.maxLength(160)])],
      'group': ['0', selectValidator]
    });
  }

  ngOnInit() {
    this.groups = this.groupService.getGroups();

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

  add(){
    //find group with selected id
    let group: Group = this.groupService.findGroup(this.selected);
    //check if recipients has a group of recipients added to it
    if(this.selectedRecipients.length !=0){
        //check and remove duplicates
        this.selectedRecipients = this.removeDuplicate();
    }
    this.selectedRecipients.push(group);
  }

  removeDuplicate(): Group[]{
    return this.selectedRecipients = this.selectedRecipients.filter((group: Group)=>{
        return group.id != this.selected;
    });
  }

  /**removes group from array of selected groups */
  remove(removeGroup: Group){
    this.selectedRecipients.forEach((group, index)=>{
      if(group.id == removeGroup.id){
        this.selectedRecipients.splice(index, 1);
      }
    });
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
