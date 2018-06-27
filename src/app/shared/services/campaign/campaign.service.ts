import { Injectable } from '@angular/core';
import { Schedule } from '../../models/schedule.model';
import { Campaign } from '../../models/campaign.model';
import { Group } from '../../models/group.model';
import { GroupManagerService } from '../group/group-manager.service';

@Injectable()
export class CampaignService {

  private campaigns: Schedule[] = [];

  constructor(private _groupService: GroupManagerService) {
    this.setCampaigns();
   }

  getCampaigns(): Schedule[]{
    return this.campaigns;
  }

  setCampaigns(){

    let receivedCampaigns: Schedule;
    let date: Date = new Date();
    for(let i = 1; i <= 50; i++){
      let schedule;
      if(i % 2 == 0){      
        schedule = new Schedule("Campaign "+i, "MONTHLY", date, date, "SCHEDULED", date);
      }else if(i % 3 == 0){
        schedule = new Schedule("Campaign "+i, "WEEKLY", date, date, "COMPLETE", date);
      }else if(i % 7 == 0){
        schedule = new Schedule("Campaign "+i, "WEEKLY", date, date, "ERROR", date);
      }else if(i == 1){
        schedule = new Schedule("Campaign "+i, "MONTHLY", date, date, "PAUSED", date);
      }else{        
        schedule = new Schedule("Campaign "+i, "DAILY", date, date, "RUNNING", date);
      }        
      this.campaigns.push(schedule);
    }
  }

  getCampaignByName(schedule: Schedule): Campaign{
    let title: string = schedule.jobName;
    let message = 'Dear customer, kindly take note that all our products have a 50% discount'+
    ' starting from June 20th until August 1st. visit our website, www.shoptiludrop.co.ke';
    let date = schedule.scheduleTime;
    let scheduleType: string = "monthly";
    let time = ''+schedule.scheduleTime.getHours()+':'+schedule.scheduleTime.getMinutes();

    let groups: Group[] = this._groupService.getGroups();

    return new Campaign(1, title, scheduleType, message, date, time, groups);
  }
}
