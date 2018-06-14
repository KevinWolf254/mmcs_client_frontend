import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OneTimeCampaignComponent } from './one-time-campaign/one-time-campaign.component';
import { ScheduledCampaignComponent } from './scheduled-campaign/scheduled-campaign.component';
import { ManageCampaignsComponent } from './manage-campaigns/manage-campaigns.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    BrowserModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    OneTimeCampaignComponent, 
    ScheduledCampaignComponent, 
    ManageCampaignsComponent
  ],
  declarations: [
    OneTimeCampaignComponent, 
    ScheduledCampaignComponent, 
    ManageCampaignsComponent
  ]
})
export class CampaignsModule { }
