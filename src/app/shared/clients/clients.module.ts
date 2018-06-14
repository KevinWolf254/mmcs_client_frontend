import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientGroupsComponent } from './client-groups/client-groups.component';
import { ClientComponent } from './client/client.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [ 
    ClientComponent, 
    ClientGroupsComponent
  ],
  declarations: [
    ClientComponent, 
    ClientGroupsComponent
  ]
})
export class ClientsModule { }
