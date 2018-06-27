import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientGroupsComponent } from './client-groups/client-groups.component';
import { ClientComponent } from './client/client.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule
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
