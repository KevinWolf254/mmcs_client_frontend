import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule, NgbCollapseModule} from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from './shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { AppComponent } from './app.component';
import { AdminModule } from './Admin/admin.module';


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
    DataTablesModule
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
