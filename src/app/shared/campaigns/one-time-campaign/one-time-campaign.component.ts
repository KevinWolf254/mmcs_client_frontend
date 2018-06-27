import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Group } from '../../models/group.model';
import { selectValidator } from '../../validators/select-validator';
import { Sms } from '../../models/sms.model';
import { GroupManagerService } from '../../services/group/group-manager.service';

@Component({
  selector: 'app-one-time-campaign',
  templateUrl: './one-time-campaign.component.html',
  styleUrls: ['./one-time-campaign.component.scss']
})
export class OneTimeCampaignComponent implements OnInit{

  private selected = 0;
  private groups: Group[] = [];
  private selectedRecipients: Group[] = [];

  private recipientsIds: number[] = [];  
  private form: FormGroup;

  constructor(private _fb: FormBuilder, private _groupManager: GroupManagerService) {
    this.form = _fb.group({
      'message': [null,Validators.compose([Validators.required, Validators.maxLength(160)])],
      'group': ['0', selectValidator]
    });
  }

  ngOnInit() {
    this.groups = this._groupManager.getGroups();
  }   

  private add(){
    //find group with selected id
    let group: Group = this._groupManager.findGroup(this.selected);
    //check if recipients has a group of recipients added to it
    if(this.selectedRecipients.length !=0){
        //check and remove duplicates
        this.selectedRecipients = this.removeDuplicate();
    }
    this.selectedRecipients.push(group);
  }

  private removeDuplicate(): Group[]{
    return this.selectedRecipients = this.selectedRecipients.filter((group: Group)=>{
        return group.id != this.selected;
    });
  }

  /**removes group from array of selected groups */
  private remove(removeGroup: Group){
    this.selectedRecipients.forEach((group, index)=>{
      if(group.id == removeGroup.id){
        this.selectedRecipients.splice(index, 1);
      }
    });
  } 

  private sendSms(formValues){
    this.selectedRecipients.forEach((group, index)=>{
      this.recipientsIds.push(group.id);
    });
    let sms = new Sms(formValues.message, this.recipientsIds);
    //reset form and selectedGroups array
    this.resetForm();
    this.resetDataValues();
  }
   
  private resetForm(){
    this.form.reset();
    this.form.get("group").setValue(0);
  }

  private resetDataValues(){
    this.selectedRecipients = [];
    this.recipientsIds = [];
  }
}
