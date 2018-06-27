import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule, NgbCollapseModule} from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { AppComponent } from './app.component';
import { AdminModule } from './Admin/admin.module';
import { AdminGuard } from './auth/admin.guard';
import { SharedGuard } from './auth/shared.guard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GroupManagerService } from './shared/services/group/group-manager.service';
import { ClientService } from './shared/services/client/client.service';
import { CampaignService } from './shared/services/campaign/campaign.service';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgbCollapseModule,
    NgxDatatableModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    AdminModule,
    SharedModule,
    BrowserAnimationsModule
  ],
  providers: [
    AdminGuard,
    SharedGuard,
    GroupManagerService,
    ClientService,
    CampaignService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
