import { Injectable } from '@angular/core';
import { Schedule, ScheduleDetails, ScheduleStatus } from '../../models/schedule.model';
import { Campaign } from '../../models/campaign.model';
import { GroupManagerService } from '../group/group-manager.service';
import { MonthlyExpenditure } from '../../models/monthly-expenditure.model';
import { HttpClient } from '@angular/common/http';
import { retry, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Sms, SmsToAll } from '../../models/sms.model';
import { AvailabilityResponse } from '../../models/response.model';

@Injectable()
export class CampaignService {
  private basicUri: string = "http://localhost:8083/mmcs";

  campaigns: Schedule[] = [];
  expenditures: MonthlyExpenditure[] = [];

  constructor(private _groupService: GroupManagerService, private _http: HttpClient) {
    this.setCampaigns();
   }

   sendRequestForMonthlyExpenditure(year: number): Observable<MonthlyExpenditure[]>{
    return this._http.get<MonthlyExpenditure[]>(this.basicUri+'/group/costs/'+year).pipe(
      retry(2),
      map(result => result)
    );
   }

  public sendNonScheduledSms(sms: Sms): Observable<any>{
    return this._http.post<any>(this.basicUri + '/secure/sms', sms);
  }
  public sendScheduledSms(sms: Sms){
    return this._http.post<any>(this.basicUri + '/secure/schedule', sms);
  }

  public checkCampaignNameAvailability(name: string):Observable<AvailabilityResponse>{
    return this._http.get<AvailabilityResponse>(this.basicUri + '/secure/schedule/'+name);
  }

  public getCampaigns(){
    return this._http.get(this.basicUri + '/secure/schedule');
  }

  public changeScheduleStatus(name: string, status: ScheduleStatus){
    return this._http.put(this.basicUri + '/secure/schedule/'+name+"/"+status, null);
  }

  setCampaigns(){
    // let receivedCampaigns: Schedule;
    // let date: Date = new Date();
    // for(let i = 1; i <= 50; i++){
    //   let schedule;
    //   if(i % 2 == 0){      
    //     schedule = new Schedule("Campaign "+i, "MONTHLY", date, date, "SCHEDULED", date);
    //   }else if(i % 3 == 0){
    //     schedule = new Schedule("Campaign "+i, "WEEKLY", date, date, "COMPLETE", date);
    //   }else if(i % 7 == 0){
    //     schedule = new Schedule("Campaign "+i, "WEEKLY", date, date, "ERROR", date);
    //   }else if(i == 1){
    //     schedule = new Schedule("Campaign "+i, "MONTHLY", date, date, "PAUSED", date);
    //   }else{        
    //     schedule = new Schedule("Campaign "+i, "DAILY", date, date, "RUNNING", date);
    //   }        
    //   this.campaigns.push(schedule);
    // }
  }

  getCampaignByName(schedule: Schedule): Campaign{
    // let title: string = schedule.jobName;
    // let scheduleType: string = "MONTHLY";
    // let message = 'Dear customer, kindly take note that all our products have a 50% discount'+
    // ' starting from June 20th until August 1st. visit our website, www.shoptiludrop.co.ke';
    // let oneTimeDate: Date = null;
    // let dayOfWeek: string = "";
    // let dateOfMonth: number = 0;
    // let time: string = "08:30 am";
    // if(scheduleType == 'ONCE'){
    //   // Get date
    //   oneTimeDate = schedule.scheduleTime;
    // }else if(scheduleType == 'MONTHLY'){
    //   // Get dateOfMonth
    //   dateOfMonth = 6;
    // }else if(scheduleType == 'WEEKLY'){
    //   //Get dayOfWeek
    //   dayOfWeek = 'MON';
    // }

    // let groups: Group[] = this._groupService.getGroups();

    // return new Campaign(1, title, scheduleType, message, oneTimeDate, dayOfWeek, dateOfMonth, time, groups);
    return null;
  }

  getExpenditures(year: number): MonthlyExpenditure[]{
    let expenditure: MonthlyExpenditure;
    for(let i=1; i<=2; i++){
      expenditure = new MonthlyExpenditure();

      expenditure.label = 'Expenditure: '+i;
      for(let j=0; j<=11; j++){
        if(j % 2 == 0 )
          expenditure.monthlyExpenditure.push(j+5);
        expenditure.monthlyExpenditure.push(j+10);
      }
      this.expenditures.push(expenditure);
    }
    return this.expenditures;
  }
}
