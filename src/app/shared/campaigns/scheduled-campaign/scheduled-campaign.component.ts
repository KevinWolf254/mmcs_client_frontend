import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { selectValidator } from '../../validators/select-validator';
import { Group } from '../../models/group.model';
import { Time } from '@angular/common';
import { GroupManagerService } from '../../services/group/group-manager.service';
import { Sms, SmsToGroup } from '../../models/sms.model';
import { ScheduleDate, ScheduleType, ScheduleDaily, ScheduleWeekly, ScheduleMonthly } from '../../models/schedule.model';
import { CampaignService } from '../../services/campaign/campaign.service';
import { stringify } from '../../../../../node_modules/@angular/core/src/util';
import { debounce, debounceTime } from '../../../../../node_modules/rxjs/operators';
import { AvailabilityResponse } from '../../models/response.model';
import { NgbDateStruct } from '../../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { ToastrService } from '../../../../../node_modules/ngx-toastr';

@Component({
  selector: 'app-scheduled-campaign',
  templateUrl: './scheduled-campaign.component.html',
  styleUrls: ['./scheduled-campaign.component.scss']
})
export class ScheduledCampaignComponent implements OnInit {

  public messageLength: number = 0;
  public canSend: boolean = true;
  public isLong: boolean = false;
  public isChecking: boolean = false;
  public isSendingSchedule = false;

  public nameIsAvailable: boolean = null;
  public checked: boolean = false;

  public selected: number = 0;
  public groups: Group[] = [];
  public selectedRecipients: Group[] = [];
  public week: string[] = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", 
                           "THURSDAY", "FRIDAY", "SATURDAY"];

  public recipientsIds: number[] = [];  
  public form: FormGroup; 

  public defaultTime = {hour: 12, minute: 30};
  public meridian: boolean = true;

  toggleMeridian() {
      this.meridian = !this.meridian;
  }

  constructor(private _fb: FormBuilder, private groupService: GroupManagerService, 
    private campaignService: CampaignService, private notify: ToastrService) { 
    this.form = _fb.group({
      'campaignName': ['',Validators.required],
      'message': ['',Validators.compose([Validators.required, Validators.maxLength(320)])],
      'group': ['0', selectValidator],
      'campaignType': ['', Validators.required]
    });
  }

  ngOnInit() {
    // retrieve groups for organisation from API
    this.groupService.getGroups().subscribe((groups: Group[]) =>{
        this.groups = groups;
      }
    );

    //check availability of campaign name
    this.form.get('campaignName').valueChanges.subscribe(name => {
      if(!this.form.get('campaignName').valid)
        this.nameIsAvailable = null;
        this.checked = false;
    });

    //observes the changes in the message textfield
    this.form.get('message').valueChanges.subscribe(message => {
        this.messageLength = message.length;
        if (this.messageLength > 160) {
          this.isLong = true;
        }else if (this.messageLength > 0 && this.messageLength <= 160){
          this.isLong = false;
        }else{
          this.isLong = false;
        }
      }
    );

    this.form.get('campaignType').valueChanges.subscribe(
      campaignType =>{
        if(campaignType == 'oneOff'){
          if(this.form.contains('recurring'))
            this.form.removeControl('recurring');
          this.form.addControl('oneOff_Date', this._fb.control('', Validators.required));
          this.form.addControl('oneOff_Time', this._fb.control(this.defaultTime, 
            Validators.required));
        }else if(campaignType == 'recurring'){
          if(this.form.contains('oneOff_Date')){
            this.form.removeControl('oneOff_Date');
            this.form.removeControl('oneOff_Time');
          }
          this.form.addControl('recurring', this._fb.control('', Validators.required));
          this.form.get('recurring').valueChanges.subscribe(
            recurring =>{
              if(recurring == 'daily'){
                if(this.form.contains('dayOfWeek')){
                  this.form.removeControl('dayOfWeek');
                  this.form.removeControl('weeklyTime');
                }else if(this.form.contains('monthlyDate')){
                  this.form.removeControl('monthlyDate');
                  this.form.removeControl('monthlyTime');
                }
                this.form.addControl('dailyTime', this._fb.control(this.defaultTime, Validators.required));                
              }else if(recurring == 'weekly'){
                if(this.form.contains('dailyTime')){
                  this.form.removeControl('dailyTime');
                }else if(this.form.contains('monthlyDate')){
                  this.form.removeControl('monthlyDate');
                  this.form.removeControl('monthlyTime');
                }
                this.form.addControl('dayOfWeek', this._fb.control(0, selectValidator)); 
                this.form.addControl('weeklyTime', this._fb.control(this.defaultTime, Validators.required));               
              }else if(recurring == 'monthly'){
                if(this.form.contains('dailyTime')){
                  this.form.removeControl('dailyTime');
                }else if(this.form.contains('dayOfWeek')){
                  this.form.removeControl('dayOfWeek');
                  this.form.removeControl('weeklyTime');
                }
                this.form.addControl('monthlyDate', this._fb.control('', Validators.required));
                this.form.addControl('monthlyTime', this._fb.control(this.defaultTime, Validators.required));               
              }
            }
          );
        }
      }
    );
  }

  public add(){
    //find group with selected id
    let group: Group = this.groupService.findGroup(this.groups, this.selected);
    //check if recipients has a group of recipients added to it
    if(this.selectedRecipients.length !=0){
        //check and remove duplicates
        this.selectedRecipients = this.removeDuplicate();
    }
    this.selectedRecipients.push(group);    
    this.recipientsIds.push(group.id);
    this.form.get("group").setValue('0');
  }

  public removeDuplicate(): Group[]{
    return this.selectedRecipients = this.selectedRecipients.filter((group: Group)=>{
        return group.id != this.selected;
    });
  }

  public removeIdsDuplicate(): number[]{
    return this.recipientsIds = this.recipientsIds.filter((id: number)=>{
        return id != this.selected;
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
  } 

  public checkName(){
    this.isChecking = true;
    let name: string = this.form.get('campaignName').value;
    this.campaignService.checkCampaignNameAvailability(name).subscribe(
      (result: AvailabilityResponse) =>{
        this.checked = true;
        this.isChecking = false;
        this.nameIsAvailable = result.isAvailable;
        console.log(this.nameIsAvailable)
      }, (error) => {
        this.checked = true;
        this.isChecking = false;
        this.nameIsAvailable = error.error.isAvailable;
        console.log(this.nameIsAvailable)
      }
    );
  }

  public sendScheduledSms(form){
    this.isSendingSchedule = true;
    let scheduledDate: Date = new Date();
    let scheduledTime: Time = {hours: 0, minutes: 0};
    let sms: Sms = null;
    let type: ScheduleType = null;

    if(form.campaignType == "oneOff"){
      type = ScheduleType.DATE;
      scheduledDate.setUTCFullYear(form.oneOff_Date.year, form.oneOff_Date.month - 1, 
        form.oneOff_Date.day);  
      scheduledTime.hours = form.oneOff_Time.hour;
      scheduledTime.minutes = form.oneOff_Time.minute;

      sms = new SmsToGroup(form.message, new ScheduleDate(form.campaignName, type, 
        scheduledDate, scheduledTime), this.recipientsIds);
    }
    else if(form.campaignType == 'recurring'){
      if(form.recurring == 'daily'){
        type = ScheduleType.DAILY;
        scheduledTime.hours = form.dailyTime.hour;
        scheduledTime.minutes = form.dailyTime.minute;

        sms = new SmsToGroup(form.message, new ScheduleDaily(form.campaignName, type, 
          scheduledTime), this.recipientsIds);

      }else if(form.recurring == 'weekly'){
        type = ScheduleType.WEEKLY;
        scheduledTime.hours = form.weeklyTime.hour;
        scheduledTime.minutes = form.weeklyTime.minute;

        sms = new SmsToGroup(form.message, new ScheduleWeekly(form.campaignName, type,
          scheduledTime, form.dayOfWeek), this.recipientsIds);
      }else if(form.recurring == 'monthly'){
        type = ScheduleType.MONTHLY
        scheduledDate.setUTCFullYear(form.monthlyDate.year, form.monthlyDate.month - 1, 
          form.monthlyDate.day);  

        scheduledTime.hours = form.monthlyTime.hour;
        scheduledTime.minutes = form.monthlyTime.minute;

        sms = new SmsToGroup(form.message, new ScheduleMonthly(form.campaignName, type, 
          scheduledDate, scheduledTime, form.monthlyDate.day), this.recipientsIds);
      }
    }
    console.log(JSON.stringify(sms));
    this.campaignService.sendScheduledSms(sms).subscribe(
      response=>{
        this.isSendingSchedule = false;
        this.notify.success(response.message, response.title);
        //reset form and select_Groups array
        this.resetDataValues();
        this.resetForm();
      }, error=>{
        this.isSendingSchedule = false;
        this.notify.error(error.error.error_description, error.error.error);
      }
    );
  }  
   
  resetForm(){
    this.form.get("campaignName").setValue('');
    this.form.get("campaignType").reset();
    this.form.get("message").setValue('');
    this.form.get("group").setValue('0');
  }

  resetDataValues(){
    this.selectedRecipients = [];
    this.recipientsIds = [];
  }
}
