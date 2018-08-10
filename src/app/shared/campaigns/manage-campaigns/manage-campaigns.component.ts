import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Schedule } from '../../models/schedule.model';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Group } from '../../models/group.model';
import { selectValidator } from '../../validators/select-validator';
import { GroupManagerService } from '../../services/group/group-manager.service';
import { CampaignService } from '../../services/campaign/campaign.service';
import { Campaign } from '../../models/campaign.model';

@Component({
  selector: 'app-manage-campaigns',
  templateUrl: './manage-campaigns.component.html',
  styleUrls: ['./manage-campaigns.component.scss']
})
export class ManageCampaignsComponent implements OnInit {

  schedules: Schedule[] = [];

  perPage: number;
  perPageNos: number[] = [10, 25, 50, 100];
  tempCampaigns = [];
  @ViewChild(DatatableComponent) table: DatatableComponent;
  customPagerIcons = {
    sortAscending: 'fa fa-sort-asc', sortDescending: 'fa fa-sort-desc', pagerLeftArrow: 'fa fa-chevron-left', 
    pagerRightArrow: 'fa fa-chevron-right', pagerPrevious: 'fa fa-step-backward', pagerNext: 'fa fa-step-forward'
  };

  scheduleStopped = {};
  
  modalRefEdit: NgbModalRef;
  modalRefDel: NgbModalRef;
  
  editableCampaign: Campaign;
  week: string[] = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];  
  form: FormGroup;
  defaultTime = {hour: 12, minute: 30};
  meridian: boolean = true;
  
  selected = 0;
  message: string;
  groupsOfSelectedCampaign: Group[] = [];
  allgroups: Group[] = [];

  deleteSchedule: Schedule;
  deleteRow: number;

  toggleMeridian() {
      this.meridian = !this.meridian;
  }

  constructor(private modalService: NgbModal, private _fb: FormBuilder, private _groupService: GroupManagerService,
  private _campaignService: CampaignService) {
    this.form = _fb.group({
    'schedule': [null],
    'message': [null,Validators.compose([Validators.required, Validators.maxLength(160)])],
    'group': [null]
    }); 
  }

  ngOnInit() {
    this.getSchedules();
    // this.allgroups =  this._groupService.getGroups();
    this.perPage = this.perPageNos[0];

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

  getSchedules(){
    this.schedules = this._campaignService.getCampaigns();
    // cache our schedules
    this.tempCampaigns = [...this.schedules];
  }

  changePageEntries(event){
    this.perPage = event.target.value;
  }

  search(event) {
    let searchParam = event.target.value.toLowerCase();
    // filter our data
    let temp = this.tempCampaigns.filter(schedule => {
      return schedule.jobName.toLowerCase().indexOf(searchParam) !== -1 || !searchParam;
    });
    // update the rows
    this.schedules = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  /*Pauses a running schedule */
  pauseSchedule(schedule, rowIndex){
    // this.schedules[rowIndex].jobStatus = "PAUSE";
    this.scheduleStopped[rowIndex] = true;
  }

  /*Runs a stopped/scheduled schedule */
  runSchedule(schedule, rowIndex){    
    console.log("Schedule: "+schedule.jobName+" resumed!");
    // this.schedules[rowIndex].jobStatus = "RUNNING";
    this.scheduleStopped[rowIndex] = false;
  }

  /*Unschedules a running schedule */
  stopSchedule(schedule, rowIndex){
    console.log("Schedule: "+schedule.jobName+" stopped!");
    // this.schedules[rowIndex].jobStatus = "SCHEDULED";
    this.scheduleStopped[rowIndex] = false;
  }

  openEditDialog(modal, schedule: Schedule, rowIndex){
    this.modalRefEdit = this.modalService.open(modal);
    this.editableCampaign = this._campaignService.getCampaignByName(schedule);

    this.groupsOfSelectedCampaign = [];
    this.groupsOfSelectedCampaign = this.editableCampaign.groups;
  }

  addGroupToCampaign(){
    //find group with selected id
    // let group: Group = this._groupService.findGroup(this.selected);
    //check if recipients has a group of recipients added to it
    if(this.groupsOfSelectedCampaign.length !=0){
        //check and remove duplicates
        this.groupsOfSelectedCampaign = this.removeDuplicate();
    }
    // this.groupsOfSelectedCampaign.push(group);
    this.selected = 0;
    // this.form.get('group').setValue(0);
  }

  removeDuplicate(): Group[]{
    return this.groupsOfSelectedCampaign = this.groupsOfSelectedCampaign.filter((group: Group)=>{
        return group.id != this.selected;
    });
  }

  /**removes group from array of selected groups */
  remove(removeGroup: Group){
    this.groupsOfSelectedCampaign.forEach((group, index)=>{
      if(group.id == removeGroup.id){
        this.groupsOfSelectedCampaign.splice(index, 1);
      }
    }); 
  } 

  sendEditedCampaign(form){

  }

  openDeletionDialog(modal, schedule, rowIndex){
    // this.deleteSchedule = new Schedule(schedule.jobName, schedule.groupName, schedule.scheduleTime, schedule.lastFiredTime, schedule.jobStatus, schedule.nextFireTime);
    this.deleteRow = rowIndex;    
    this.modalRefDel = this.modalService.open(modal);
  }

  deleteCampaign(){
    this.schedules.splice(this.deleteRow, 1);
    this.schedules = [...this.schedules];
    this.tempCampaigns = [...this.schedules];
    this.modalRefDel.close(); 
  }
}
