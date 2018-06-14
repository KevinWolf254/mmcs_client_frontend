import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user/user.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { UsersComponent } from './users.component';
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
    UserComponent,
    UsersComponent
  ],
  declarations: [
    UsersComponent, 
    UserComponent
  ],
  bootstrap: [UserComponent]
})
export class UsersModule { }
