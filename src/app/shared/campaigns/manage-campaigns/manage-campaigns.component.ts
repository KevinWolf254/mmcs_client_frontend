import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ScheduleDetails, ScheduleStatus } from '../../models/schedule.model';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { CampaignService } from '../../services/campaign/campaign.service';
import { ToastrService } from '../../../../../node_modules/ngx-toastr';

@Component({
  selector: 'app-manage-campaigns',
  templateUrl: './manage-campaigns.component.html',
  styleUrls: ['./manage-campaigns.component.scss']
})
export class ManageCampaignsComponent implements OnInit {

  public schedules: ScheduleDetails[] = [];

  public tempSchedules = [];

  public deleteSchedule: ScheduleDetails;

  public modalRefDel: NgbModalRef;

  public perPage: number;
  public perPageNos: number[] = [10, 25, 50, 100];
  @ViewChild(DatatableComponent) table: DatatableComponent;
  customPagerIcons = {
    sortAscending: 'fa fa-sort-asc', sortDescending: 'fa fa-sort-desc', 
    pagerLeftArrow: 'fa fa-chevron-left', pagerRightArrow: 'fa fa-chevron-right', 
    pagerPrevious: 'fa fa-step-backward', pagerNext: 'fa fa-step-forward'
  };  

  constructor(private modalService: NgbModal, private notify: ToastrService,
    private campaignService: CampaignService){}

  ngOnInit() {
    this.getSchedules();
    this.perPage = this.perPageNos[0];
  }

  public getSchedules(){
    this.campaignService.getCampaigns().subscribe(
      (response: any) => {
        console.log(response);
        this.schedules = response;
        // cache our schedules
        this.tempSchedules = [...this.schedules];
      }
    );
  }

  public changePageEntries(event){
    this.perPage = event.target.value;
  }

  public search(event) {
    let searchParam = event.target.value.toLowerCase();
    // filter our data
    let temp = this.tempSchedules.filter(schedule => {
      return schedule.name.toLowerCase().indexOf(searchParam) !== -1 || !searchParam;
    });
    // update the rows
    this.schedules = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  /*Pauses a running schedule */
  public pause(schedule, rowIndex){
    let name: string = schedule.name;
    this.campaignService.changeScheduleStatus(name, ScheduleStatus.PAUSED).subscribe(
      (response: any) => {
        this.notify.success(response.message, response.title);
        this.getSchedules();
      }, error => {
        this.notify.error(error.error.error_description, error.error.error);
      }
    );
    // this.scheduleStopped[rowIndex] = true;
  }

  /*Runs a stopped/scheduled schedule */
  public start(schedule, rowIndex){   
    let name: string = schedule.name;
    this.campaignService.changeScheduleStatus(name, ScheduleStatus.SCHEDULED).subscribe(
      (response: any) => {
        this.notify.success(response.message, response.title);
        this.getSchedules();
      }, error => {
        this.notify.error(error.error.error_description, error.error.error);
      }
    ); false;
  }

  /*Unschedules a running schedule */
  public stop(schedule, rowIndex){
    let name: string = schedule.name;
    this.campaignService.changeScheduleStatus(name, ScheduleStatus.BLOCKED).subscribe(
      (response: any) => {
        this.notify.success(response.message, response.title);
        this.getSchedules();
      }, error => {
        this.notify.error(error.error.error_description, error.error.error);
      }
    ); 
  }

  public delete(modal, schedule: ScheduleDetails, rowIndex){
    this.deleteSchedule = new ScheduleDetails(schedule.name, schedule.type, schedule.schedule,
      schedule.nextFire, schedule.lastFired, schedule.status);
    this.modalRefDel = this.modalService.open(modal);
  }

  public deletionConfirmed(){    
    let name: string = this.deleteSchedule.name;
    this.campaignService.changeScheduleStatus(name, ScheduleStatus.NONE).subscribe(
      (response: any) => {
        this.notify.success(response.message, response.title);
        this.getSchedules();
      }, error => {
        this.notify.error(error.error.error_description, error.error.error);
      }
    );
    this.modalRefDel.close(); 
  }
}
