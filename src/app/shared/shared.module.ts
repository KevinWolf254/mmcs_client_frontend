import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './sign-in/sign-in.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavigationModule } from './navigation/navigation.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { CampaignsComponent } from './campaigns/campaigns.component';
import { CampaignsModule } from './campaigns/campaigns.module';
import { ClientsModule } from './clients/clients.module';
import { ClientsComponent } from './clients/clients.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { DataTablesModule } from 'angular-datatables';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    DataTablesModule,
    ReactiveFormsModule,
    NgbModule,
    NavigationModule,
    CampaignsModule,
    ClientsModule,
    NgxDatatableModule
  ],
  exports: [
    SignInComponent
  ],
  declarations: [
    SignInComponent, 
    UserProfileComponent, 
    CampaignsComponent,
    ClientsComponent
  ]
})
export class SharedModule { }
