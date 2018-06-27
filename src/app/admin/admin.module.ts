import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersModule } from './users/users.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavigationModule } from '../shared/navigation/navigation.module';
import { NgbModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { UnitsComponent } from './units/units.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminComponent } from './admin.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    UsersModule,
    NavigationModule,
    BrowserModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule
  ],
  exports:[
    AdminComponent, 
    DashboardComponent
  ],
  declarations: [
    AdminComponent, 
    DashboardComponent,
    UnitsComponent
  ],
  bootstrap: [
    UnitsComponent
  ]
})
export class AdminModule { }
