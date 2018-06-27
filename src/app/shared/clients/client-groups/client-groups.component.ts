import { Component, OnInit, ViewChild } from '@angular/core';
import { Group } from '../../models/group.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { selectValidator } from '../../validators/select-validator';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ClientTeleco } from '../../models/client-teleco.model';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-client-groups',
  templateUrl: './client-groups.component.html',
  styleUrls: ['./client-groups.component.scss']
})
export class ClientGroupsComponent implements OnInit {

  private entriesPerPage: number;
  private perPageNos: number[] = [10, 25, 50, 100];
  private tempClients: ClientTeleco[] = [];
  @ViewChild(DatatableComponent) table: DatatableComponent;
  private customPagerIcons = {
    sortAscending: 'fa fa-sort-asc', sortDescending: 'fa fa-sort-desc', pagerLeftArrow: 'fa fa-chevron-left', 
    pagerRightArrow: 'fa fa-chevron-right', pagerPrevious: 'fa fa-step-backward', pagerNext: 'fa fa-step-forward'
  };

  private groupClients: ClientTeleco[] = [];

  private selected: number = 0;
  private groups: Group[] = [];
  private createForm: FormGroup;
  private deleteForm: FormGroup;
  
  private editableClientModal: NgbModalRef;
  private removableClientModal: NgbModalRef;

  private editableClient: ClientTeleco = null;
  private editableRow: number;

  private removableClient: ClientTeleco = null;
  private removableRow: number;

  constructor(private _fb: FormBuilder, private modalService: NgbModal) { 
    this.createForm = _fb.group({
      'name': [null,Validators.required]
    });
    this.deleteForm = _fb.group({
      'group': ['0',selectValidator]
    });
  }

  ngOnInit() {
    this.getGroupsFromWebApi();
    this.entriesPerPage = this.perPageNos[0];
  }
  /*retrieves all groups from web service to select */
  private getGroupsFromWebApi(){
    let allGroups: Group;
    for(let i=1; i<11; i++){
      allGroups = new Group(i, "Group "+i);
      this.groups.push(allGroups);
    } 
  } 

  private getGroupClients(event){
    let groupId = event.target.value;
    this.getGroupClientsFromWebApi(groupId);
  }

  private getGroupClientsFromWebApi(groupId: number){
    let client: ClientTeleco;
    this.groupClients = [];
    for(let i=1; i<=50; i++){
      client = new ClientTeleco(i, '+254', 724000000 + i, 'Client '+i, "Safaricom-Ke");
      this.groupClients.push(client);
    }
    this.groupClients = [...this.groupClients];
  }

  private changeEntriesPerPage(event){
    this.entriesPerPage = event.target.value;
  }

  private searchClient(event) {

    let searchParam = event.target.value.toLowerCase();

    // filter our data
    let tempClients = this.tempClients.filter((client: ClientTeleco) => {
      return client.fullName.toLowerCase().indexOf(searchParam) !== -1 || !searchParam;
    });

    // update the rows
    this.groupClients = tempClients;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  private createGroup(form){

  }

  private openClientDetailsDialog(clientDetailsModal, selectedClient: ClientTeleco, rowIndex){
    this.editableClient = new ClientTeleco(selectedClient.clientId, selectedClient.countryCode, 
      selectedClient.phoneNo, selectedClient.fullName, selectedClient.telecom);
    this.editableRow = rowIndex;    
    this.editableClientModal = this.modalService.open(clientDetailsModal);
  }

  private openRemoveClientDialog(deleteClientModal, selectedClient: ClientTeleco, rowIndex){
    this.removableClient =new ClientTeleco(selectedClient.clientId, selectedClient.countryCode, 
      selectedClient.phoneNo, selectedClient.fullName, selectedClient.telecom);
    this.removableClient = rowIndex;    
    this.removableClientModal = this.modalService.open(deleteClientModal);
  }
  
  private deleteGroup(form){

  }
}
