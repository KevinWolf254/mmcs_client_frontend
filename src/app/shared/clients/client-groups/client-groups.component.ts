import { Component, OnInit, ViewChild } from '@angular/core';
import { Group } from '../../models/group.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { selectValidator } from '../../validators/select-validator';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ClientTeleco } from '../../models/client-teleco.model';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GroupManagerService } from '../../services/group/group-manager.service';
import { ClientService } from '../../services/client/client.service';

@Component({
  selector: 'app-client-groups',
  templateUrl: './client-groups.component.html',
  styleUrls: ['./client-groups.component.scss']
})
export class ClientGroupsComponent implements OnInit {

  entriesPerPage: number;
  perPageNos: number[] = [10, 25, 50, 100];
  tempClients: ClientTeleco[] = [];
  @ViewChild(DatatableComponent) table: DatatableComponent;
  customPagerIcons = {
    sortAscending: 'fa fa-sort-asc', sortDescending: 'fa fa-sort-desc', pagerLeftArrow: 'fa fa-chevron-left', 
    pagerRightArrow: 'fa fa-chevron-right', pagerPrevious: 'fa fa-step-backward', pagerNext: 'fa fa-step-forward'
  };

  groupClients: ClientTeleco[] = [];

  selected: number = 0;
  groups: Group[] = [];
  createForm: FormGroup;
  deleteForm: FormGroup;

  selectedGroupId: number = 0;
  
  editableClientModal: NgbModalRef;
  removableClientModal: NgbModalRef;

  editableClient: ClientTeleco;
  editableRow: number;

  removableClient: ClientTeleco = null;
  removableRow: number;

  constructor(private _fb: FormBuilder, private modalService: NgbModal, private _groupManager: GroupManagerService, private _clientService: ClientService) { 
    this.createForm = _fb.group({
      'name': [null,Validators.required]
    });
    this.deleteForm = _fb.group({
      'group': ['0',selectValidator]
    });
  }

  ngOnInit() {    
    this.groups = this._groupManager.getGroups();

    this.entriesPerPage = this.perPageNos[0];
  } 

  getGroupClients(event){
    let groupId = event.target.value;
    this.getGroupClientsFromWebApi(groupId);
  }

  getGroupClientsFromWebApi(groupId: number){
    this.groupClients = this._clientService.findClientsByGroupId(groupId);
    // cache our clients
    this.tempClients = [...this.groupClients];
  }

  changeEntriesPerPage(event){
    this.entriesPerPage = event.target.value;
  }

  searchClient(event) {

    let searchParam = event.target.value.toLowerCase();

    // filter our data
    let tempClients = this.tempClients.filter((client: ClientTeleco) => {
      return client.name.toLowerCase().indexOf(searchParam) !== -1 || !searchParam;
    });

    // update the rows
    this.groupClients = tempClients;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  createGroup(form){
    this._groupManager.createGroup(form.name);
    this.createForm.reset();
  }

  openClientDetailsDialog(clientDetailsModal, selectedClient: ClientTeleco, rowIndex){
    this.editableClient = new ClientTeleco(selectedClient.id, selectedClient.countryCode, 
      selectedClient.phoneNumber, selectedClient.name, selectedClient.telecom);
    this.editableRow = rowIndex;    
    this.editableClientModal = this.modalService.open(clientDetailsModal);
  }

  openRemoveClientDialog(removeClientModal, selectedClient: ClientTeleco, rowIndex){
    this.removableClient = new ClientTeleco(selectedClient.id, selectedClient.countryCode, 
      selectedClient.phoneNumber, selectedClient.name, selectedClient.telecom);
    this.removableRow = rowIndex;
    this.removableClientModal = this.modalService.open(removeClientModal);
  }
  
  deleteGroup(form){
    this._groupManager.deleteGroup(form.group);
    this.deleteForm.reset();
    this.deleteForm.get(['group']).setValue(0);
    this.groupClients = [];
  }

  removeClientFromGroup(){    
    this.groupClients.splice(this.removableRow, 1);
    this.groupClients = [...this.groupClients];
    this.tempClients = [...this.groupClients];
    this.removableClientModal.close(); 
  }
}
