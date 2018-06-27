import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Schedule } from '../../models/schedule.model';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Group } from '../../models/group.model';
import { selectValidator } from '../../validators/select-validator';

@Component({
  selector: 'app-manage-campaigns',
  templateUrl: './manage-campaigns.component.html',
  styleUrls: ['./manage-campaigns.component.scss']
})
export class ManageCampaignsComponent implements OnInit {

  private schedules: Schedule[] = [];

  private perPage: number;
  private perPageNos: number[] = [10, 25, 50, 100];
  private temp = [];
  @ViewChild(DatatableComponent) table: DatatableComponent;
  private customPagerIcons = {
    sortAscending: 'fa fa-sort-asc', sortDescending: 'fa fa-sort-desc', pagerLeftArrow: 'fa fa-chevron-left', 
    pagerRightArrow: 'fa fa-chevron-right', pagerPrevious: 'fa fa-step-backward', pagerNext: 'fa fa-step-forward'
  };

  private scheduleStopped = {};
  
  private modalRefEdit: NgbModalRef;
  private modalRefDel: NgbModalRef;

  private editCampaign: Schedule;
  private week: string[] = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];  
  private form: FormGroup;
  private defaultTime = {hour: 12, minute: 30};
  private meridian: boolean = true;
  
  private selected = 0;
  private message: string;
  private groups: Group[] = [];
  private allgroups: Group[] = [];

  private time: string = '';
  private day: string = '';
  private date: number = null;

  private deleteSchedule: Schedule;
  private deleteRow: number;

  toggleMeridian() {
      this.meridian = !this.meridian;
  }

  constructor(private modalService: NgbModal, private _fb: FormBuilder) {
    this.form = _fb.group({
    'schedule': [null],
    'message': [null,Validators.compose([Validators.required, Validators.maxLength(160)])],
    'group': [null]
    }); 
  }

  ngOnInit() {
    this.getSchedules();
    this.perPage = this.perPageNos[0];
    this.getAllGroups();

    this.form.get('schedule').valueChanges.subscribe( type =>{
        if(type == 'DAILY'){
          if(this.form.contains('dayOfWeek')){
            this.form.removeControl('dayOfWeek');
            this.form.removeControl('weeklyTime');
          }else if(this.form.contains('monthlyDate')){
            this.form.removeControl('monthlyDate');
            this.form.removeControl('monthlyTime');
          }
          this.form.addControl('dailyTime', this._fb.control(this.defaultTime, Validators.required)); 
        }else if (type == 'WEEKLY'){
          if(this.form.contains('dailyTime')){
            this.form.removeControl('dailyTime');
          }else if(this.form.contains('monthlyDate')){
            this.form.removeControl('monthlyDate');
            this.form.removeControl('monthlyTime');
          }
          this.form.addControl('dayOfWeek', this._fb.control(0, selectValidator)); 
          this.form.addControl('weeklyTime', this._fb.control(this.defaultTime, Validators.required));
        }else if (type == 'MONTHLY'){
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

  private getAllGroups(){
    for(let i=1; i<=25; i++){
      this.allgroups.push({id: i, name: 'Group '+i});
    }
  }
  private edit(editModal){
    this.modalService.open(editModal);
  }

  private getSchedules(){
    // let date: string = (new Date().toISOString().slice(0,10));
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
      this.schedules.push(schedule);
    }
    // cache our schedules
    this.temp = [...this.schedules];
  }

  private changePageEntries(event){
    this.perPage = event.target.value;
  }

  private search(event) {
    let searchParam = event.target.value.toLowerCase();

    // filter our data
    let temp = this.temp.filter(schedule => {
      return schedule.jobName.toLowerCase().indexOf(searchParam) !== -1 || !searchParam;
    });

    // update the rows
    this.schedules = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  /*Pauses a running schedule */
  private pauseSchedule(schedule, rowIndex){
    console.log("Schedule: "+schedule.jobName+" stopped!");
    this.schedules[rowIndex].jobStatus = "PAUSE";
    this.scheduleStopped[rowIndex] = true;
  }

  /*Runs a stopped/scheduled schedule */
  private runSchedule(schedule, rowIndex){    
    console.log("Schedule: "+schedule.jobName+" resumed!");
    this.schedules[rowIndex].jobStatus = "RUNNING";
    this.scheduleStopped[rowIndex] = false;
  }

  /*Unschedules a running schedule */
  private stopSchedule(schedule, rowIndex){
    console.log("Schedule: "+schedule.jobName+" stopped!");
    this.schedules[rowIndex].jobStatus = "SCHEDULED";
    this.scheduleStopped[rowIndex] = false;
  }

  private editSchedule(modal, schedule: Schedule, rowIndex){
    this.modalRefEdit = this.modalService.open(modal);
    this.editCampaign = new Schedule(schedule.jobName, schedule.groupName, schedule.scheduleTime, schedule.lastFiredTime, schedule.jobStatus, schedule.nextFireTime);
    this.getCampaignDetails(schedule);
    let date = schedule.scheduleTime;
    if(schedule.groupName == 'DAILY'){
      let hour = schedule.scheduleTime.getHours();
      let minutes = schedule.scheduleTime.getMinutes()
      this.time = ''+hour+':'+minutes;
    }else if(schedule.groupName == 'WEEKLY'){
      let hour = schedule.scheduleTime.getHours();
      let minutes = schedule.scheduleTime.getMinutes()
      this.time = ''+hour+':'+minutes;
      this.day = 'Fri'
    }else if(schedule.groupName == 'MONTHLY'){
      let hour = schedule.scheduleTime.getHours();
      let minutes = schedule.scheduleTime.getMinutes()
      this.time = ''+hour+':'+minutes;
      this.date = schedule.scheduleTime.getDate();//.toISOString().slice(0,10);
    }
  }

  private getCampaignDetails(schedule: Schedule){
    let title: string = schedule.jobName;
    this.message = 'Dear customer, kindly take note that all our products have a 50% discount'+
    ' starting from June 20th until August 1st. visit our website, www.shoptiludrop.co.ke';
    this.groups = [];
    for(let i=1; i<=10; i++){
      this.groups.push({id: i, name: 'Group '+i});
    }
  }

  private addToCampaignGroups(){
    //find group with selected id
    let group: Group = this.findInList();
    //check if recipients has a group of recipients added to it
    if(this.groups.length !=0){
        //check and remove duplicates
        this.groups = this.removeDuplicate();
    }
    this.groups.push(group);
    this.selected = 0;
    // this.form.get('group').setValue(0);
  }

  private findInList(): Group{
    let foundGroup: Group = this.allgroups.find((group: Group) =>{
      return group.id == this.selected;
    });
    return foundGroup;
  }

  private removeDuplicate(): Group[]{
    return this.groups = this.groups.filter((group: Group)=>{
        return group.id != this.selected;
    });
  }

  /**removes group from array of selected groups */
  private remove(removeGroup: Group){
    this.groups.forEach((group, index)=>{
      if(group.id == removeGroup.id){
        this.groups.splice(index, 1);
      }
    }); 
  } 

  private sendEditedCampaign(form){

  }

  private openDeletionDialog(modal, schedule, rowIndex){
    this.deleteSchedule = new Schedule(schedule.jobName, schedule.groupName, schedule.scheduleTime, schedule.lastFiredTime, schedule.jobStatus, schedule.nextFireTime);
    this.deleteRow = rowIndex;    
    this.modalRefDel = this.modalService.open(modal);
  }

  private deleteCampaign(){
    this.schedules.splice(this.deleteRow, 1);
    this.schedules = [...this.schedules];
    this.modalRefDel.close(); 
  }
}
