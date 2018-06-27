import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { selectValidator } from '../../validators/select-validator';
import { Group } from '../../models/group.model';
import { Sms } from '../../models/sms.model';
import { SmsScheduledOnce } from '../../models/sms-scheduled/sms-scheduled-once.model';
import { SmsScheduled } from '../../models/sms-scheduled/sms-scheduled.model';
import { Time } from '@angular/common';
import { SmsScheduledWeekly } from '../../models/sms-scheduled/sms-scheduled-weekly.model';
import { SmsScheduledMonthly } from '../../models/sms-scheduled/sms-scheduled-monthly.model';
import { GroupManagerService } from '../../services/group/group-manager.service';

@Component({
  selector: 'app-scheduled-campaign',
  templateUrl: './scheduled-campaign.component.html',
  styleUrls: ['./scheduled-campaign.component.scss']
})
export class ScheduledCampaignComponent implements OnInit {

  private selected = 0;
  private groups: Group[] = [];
  private selectedRecipients: Group[] = [];
  private week: string[] = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  private recipientsIds: number[] = [];  
  private form: FormGroup; 

  private defaultTime = {hour: 12, minute: 30};
  private meridian: boolean = true;

  toggleMeridian() {
      this.meridian = !this.meridian;
  }
  constructor(private _fb: FormBuilder, private _groupManager: GroupManagerService) { 
    this.form = _fb.group({
      'campaignName': [null,Validators.required],
      'message': [null,Validators.compose([Validators.required, Validators.maxLength(160)])],
      'group': ['0', selectValidator],
      'campaign': ['', Validators.required]
    });
  }

  ngOnInit() {
    this.groups = this._groupManager.getGroups();

    this.form.get('campaign').valueChanges.subscribe(
      campaign =>{
        if(campaign == 'once'){
          if(this.form.contains('schedule'))
            this.form.removeControl('schedule');
          this.form.addControl('scheduledOnce_Date', this._fb.control('', Validators.required));
          this.form.addControl('scheduledOnce_Time', this._fb.control(this.defaultTime, Validators.required));
        }else if(campaign == 'scheduled'){
          if(this.form.contains('oneTimeDate')){
            this.form.removeControl('oneTimeDate');
            this.form.removeControl('time');
          }
          this.form.addControl('schedule', this._fb.control('', Validators.required));
          this.form.get('schedule').valueChanges.subscribe(
            schedule =>{
              if(schedule == 'daily'){
                if(this.form.contains('dayOfWeek')){
                  this.form.removeControl('dayOfWeek');
                  this.form.removeControl('weeklyTime');
                }else if(this.form.contains('monthlyDate')){
                  this.form.removeControl('monthlyDate');
                  this.form.removeControl('monthlyTime');
                }
                this.form.addControl('dailyTime', this._fb.control(this.defaultTime, Validators.required));                
              }else if(schedule == 'weekly'){
                if(this.form.contains('dailyTime')){
                  this.form.removeControl('dailyTime');
                }else if(this.form.contains('monthlyDate')){
                  this.form.removeControl('monthlyDate');
                  this.form.removeControl('monthlyTime');
                }
                this.form.addControl('dayOfWeek', this._fb.control(0, selectValidator)); 
                this.form.addControl('weeklyTime', this._fb.control(this.defaultTime, Validators.required));               
              }else if(schedule == 'monthly'){
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

  /*retrieves all groups from web service to select */
  private getGroups(){
    let receivedGroup: Group;
    for(let i=1; i<11; i++){
        receivedGroup = new Group(i, "Group "+i);
        this.groups.push(receivedGroup);
    } 
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

  private sendSms(value){
    this.selectedRecipients.forEach((group, index)=>{
      this.recipientsIds.push(group.id);
    });
    let sms = new Sms(value.message, this.recipientsIds);
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

  private sendScheduledSms(form){
    // Scheduled at particular date
    let campaignName: string = form.campaignName;
    let smsMessage: string = form.message;
    let scheduledDate: Date = new Date();
    let scheduledTime: Time = {hours: 0, minutes: 0};
    if(form.campaign == "once"){
      scheduledDate.setFullYear(form.scheduledOnce_Date.year, form.scheduledOnce_Date.month, form.scheduledOnce_Date.day);
      let sms: SmsScheduledOnce = new SmsScheduledOnce(campaignName, form.campaign, smsMessage, this.recipientsIds, scheduledDate, form.scheduledOnce_Time);
      let cronExpression = sms.getCronExpression();
      // send to web api simple schedule
      console.log("SMS Details: "+sms+"Cron Expression: "+cronExpression);
    }else if(form.campaign == 'scheduled'){
      if(form.schedule == 'daily'){
        scheduledTime.hours = form.dailyTime.hour;
        scheduledTime.minutes = form.dailyTime.minute;
        let dailySms: SmsScheduled = new SmsScheduled(campaignName, form.campaign, smsMessage, this.recipientsIds, scheduledTime);
        let cronExpression = dailySms.getCronExpression();
        // send to web api cron schedule
        console.log("SMS Details: "+dailySms+"Cron Expression: "+cronExpression);
      }else if(form.schedule == 'weekly'){
        scheduledTime.hours = form.weeklyTime.hour;
        scheduledTime.minutes = form.weeklyTime.minute;
        let weeklySms: SmsScheduledWeekly = new SmsScheduledWeekly(campaignName, form.campaign, smsMessage, this.recipientsIds, form.dayOfWeek, scheduledTime);
        let cronExpression = weeklySms.getCronExpression();
        // send to web api cron schedule
        console.log("SMS Details: "+weeklySms+"Cron Expression: "+cronExpression);
      }else if(form.schedule == 'monthly'){
        scheduledTime.hours = form.monthlyTime.hour;
        scheduledTime.minutes = form.monthlyTime.minute;
        let monthlySms: SmsScheduledMonthly = new SmsScheduledMonthly(campaignName, form.campaign, smsMessage, this.recipientsIds, form.monthlyDate.day, scheduledTime);
        let cronExpression = monthlySms.getCronExpression();
        // send to web service cron schedule
        console.log("SMS Details: "+monthlySms+"Cron Expression: "+cronExpression);
      }
    }
  }
}
