import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Schedule } from '../../models/schedule.model';
import { DatatableComponent } from '@swimlane/ngx-datatable';

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

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    this.getSchedules();
    this.perPage = this.perPageNos[0];
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
        schedule = new Schedule("schedule "+i, "MONTHLY", date, date, "SCHEDULED", date);
      }else if(i % 3 == 0){
        schedule = new Schedule("schedule "+i, "WEEKLY", date, date, "COMPLETE", date);
      }else if(i % 7 == 0){
        schedule = new Schedule("schedule "+i, "WEEKLY", date, date, "ERROR", date);
      }else if(i == 1){
        schedule = new Schedule("schedule "+i, "MONTHLY", date, date, "PAUSED", date);
      }else{        
        schedule = new Schedule("schedule "+i, "DAILY", date, date, "RUNNING", date);
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

  private editSchedule(modal, schedule, rowIndex){
    this.modalRefEdit = this.modalService.open(modal);
  }
}
