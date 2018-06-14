import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { UserComponent } from './Admin/users/user/user.component';
import { UnitsComponent } from './Admin/units/units.component';
import { AdminModule } from './Admin/admin.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    AdminModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
