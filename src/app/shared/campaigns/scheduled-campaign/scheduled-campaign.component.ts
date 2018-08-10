import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { selectValidator } from '../../validators/select-validator';
import { Group } from '../../models/group.model';
import { Time } from '@angular/common';
import { GroupManagerService } from '../../services/group/group-manager.service';
import { Sms, SmsToGroup } from '../../models/sms.model';
import { ScheduleDate, ScheduleType } from '../../models/schedule.model';
import { CampaignService } from '../../services/campaign/campaign.service';
import { stringify } from '../../../../../node_modules/@angular/core/src/util';

@Component({
  selector: 'app-scheduled-campaign',
  templateUrl: './scheduled-campaign.component.html',
  styleUrls: ['./scheduled-campaign.component.scss']
})
export class ScheduledCampaignComponent implements OnInit {

  public messageLength: number = 0;
  public canSend: boolean = true;
  public isLong: boolean = false;

  selected = 0;
  public groups: Group[] = [];
  selectedRecipients: Group[] = [];
  week: string[] = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  recipientsIds: number[] = [];  
  form: FormGroup; 

  defaultTime = {hour: 12, minute: 30};
  meridian: boolean = true;

  toggleMeridian() {
      this.meridian = !this.meridian;
  }
  constructor(private _fb: FormBuilder, private groupService: GroupManagerService, 
    private campaignService: CampaignService) { 
    this.form = _fb.group({
      'campaignName': [null,Validators.required],
      'message': [null,Validators.compose([Validators.required, Validators.maxLength(320)])],
      'group': ['0', selectValidator],
      'campaign': ['', Validators.required]
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
        }else if (this.messageLength > 0 && this.messageLength <= 160){
          this.isLong = false;
        }else{
          this.isLong = false;
        }
      }
    );

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
  // getGroups(){
  //   let receivedGroup: Group;
  //   for(let i=1; i<11; i++){
  //       receivedGroup = new Group(i, "Group "+i);
  //       this.groups.push(receivedGroup);
  //   } 
  // } 

  public add(){
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
  }

  public removeDuplicate(): Group[]{
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
  } 

  // sendSms(form){
  //   this.selectedRecipients.forEach((group, index)=>{
  //     this.recipientsIds.push(group.id);
  //   });
  //   // let sms = new SmsGroup(form.message, this.recipientsIds);
  //   //reset form and selectedGroups array
  //   this.resetForm();
  //   this.resetDataValues();
  // }
   
  resetForm(){
    this.form.reset();
    this.form.get("group").setValue(0);
  }

  resetDataValues(){
    this.selectedRecipients = [];
    this.recipientsIds = [];
  }

  checkName(){}

  sendScheduledSms(form){
    let scheduledDate: Date = new Date();
    let scheduledTime: Time = {hours: 0, minutes: 0};
    if(form.campaign == "once"){
      let type: ScheduleType = ScheduleType.DATE;
      scheduledDate.setFullYear(form.scheduledOnce_Date.year, form.scheduledOnce_Date.month, 
        form.scheduledOnce_Date.day);  

      scheduledTime.hours = form.scheduledOnce_Time.hour;
      scheduledTime.minutes = form.scheduledOnce_Time.minute;

      let sms: Sms = new SmsToGroup(form.message, new ScheduleDate(form.campaignName, type, 
        scheduledDate, scheduledTime), this.recipientsIds);
        console.log(JSON.stringify(sms)); 
      this.campaignService.sendScheduledSms(sms).subscribe(
        response=>{
          console.log(response);
        }
      );
      // let sms: SmsScheduledOnce = new SmsScheduledOnce(form.message, this.recipientsIds, form.campaignName, 
      //   form.campaign, form.scheduledOnce_Time, scheduledDate);
      // let cronExpression = sms.getCronExpression();
      // send to web api simple schedule
      // console.log("SMS Details: "+sms+"Cron Expression: "+cronExpression);
    }
    // else if(form.campaign == 'scheduled'){
    //   if(form.schedule == 'daily'){
    //     scheduledTime.hours = form.dailyTime.hour;
    //     scheduledTime.minutes = form.dailyTime.minute;
    //     let dailySms: SmsScheduled = new SmsScheduled(form.message, this.recipientsIds, form.campaignName, 
    //       form.campaign, scheduledTime);
    //     let cronExpression = dailySms.getCronExpression();
    //     // send to web api cron schedule
    //     console.log("SMS Details: "+dailySms+"Cron Expression: "+cronExpression);
    //   }else if(form.schedule == 'weekly'){
    //     scheduledTime.hours = form.weeklyTime.hour;
    //     scheduledTime.minutes = form.weeklyTime.minute;
    //     let weeklySms: SmsScheduledWeekly = new SmsScheduledWeekly(form.message, this.recipientsIds, 
    //       form.campaignName, form.campaign, scheduledTime, form.dayOfWeek);
    //     let cronExpression = weeklySms.getCronExpression();
    //     // send to web api cron schedule
    //     console.log("SMS Details: "+weeklySms+"Cron Expression: "+cronExpression);
    //   }else if(form.schedule == 'monthly'){
    //     scheduledTime.hours = form.monthlyTime.hour;
    //     scheduledTime.minutes = form.monthlyTime.minute;
    //     let monthlySms: SmsScheduledMonthly = new SmsScheduledMonthly(form.message, this.recipientsIds, 
    //       form.campaignName, form.campaign, scheduledTime, form.monthlyDate.day);
    //     let cronExpression = monthlySms.getCronExpression();
    //     // send to web service cron schedule
    //     console.log("SMS Details: "+monthlySms+"Cron Expression: "+cronExpression);
    //   }
    // }
  }
}
