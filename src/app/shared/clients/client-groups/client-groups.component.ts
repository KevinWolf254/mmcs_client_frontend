import { Component, OnInit, ViewChild } from '@angular/core';
import { Group } from '../../models/group.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { selectValidator } from '../../validators/select-validator';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GroupManagerService } from '../../services/group/group-manager.service';
import { ClientService } from '../../services/client/client.service';
import { Client, ContactDetails } from '../../models/client.model';
import { ToastrService } from '../../../../../node_modules/ngx-toastr';

@Component({
  selector: 'app-client-groups',
  templateUrl: './client-groups.component.html',
  styleUrls: ['./client-groups.component.scss']
})
export class ClientGroupsComponent implements OnInit {

  public entriesPerPage: number;
  public perPageNos: number[] = [10, 25, 50, 100];
  public tempContacts: ContactDetails[] = [];

  public isCreatingGroup: boolean = false;
  public isDeletingGroup: boolean = false;

  public groups: Group[] = [];  
  public createForm: FormGroup;
  public deleteForm: FormGroup;
  
  public groupContacts: ContactDetails[] = [];
  private removeModal: NgbModalRef;

  public removeContact: ContactDetails = null;
  public removeRow: number;

  public selectedGroupId: number = 0;
  public selectedGroup: Group;

  @ViewChild(DatatableComponent) table: DatatableComponent;
  customPagerIcons = {
    sortAscending: 'fa fa-sort-asc', sortDescending: 'fa fa-sort-desc', pagerLeftArrow: 'fa fa-chevron-left', 
    pagerRightArrow: 'fa fa-chevron-right', pagerPrevious: 'fa fa-step-backward', pagerNext: 'fa fa-step-forward'
  };

  constructor(private _fb: FormBuilder, private modalService: NgbModal, private notify: ToastrService,
    private groupService: GroupManagerService, private contactService: ClientService) { 
    this.createForm = _fb.group({
      'name': [null,Validators.required]
    });
    this.deleteForm = _fb.group({
      'group': ['0',selectValidator]
    });
  }

  ngOnInit() {    
    this.getGroups();

    this.entriesPerPage = this.perPageNos[0];
  } 
  
  private getGroups() {
    this.groupService.getGroups().subscribe(response => {
      this.groups = response;
    });
  }

  public searchContact(event) {
    let searchParam = event.target.value.toLowerCase();
    // filter our data
    let tempContacts = this.tempContacts.filter((contact: ContactDetails) => {
      return contact.phoneNumber.indexOf(searchParam) !== -1 || !searchParam;
    });
    // update the rows
    this.groupContacts = tempContacts;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  public createGroup(form) {
    this.isCreatingGroup = true;
    this.groupService.saveGroup(form.name).subscribe(
      (response: any) => {
        this.createForm.reset();
        this.isCreatingGroup = false;
        this.notify.success(response.message, response.title);
      }, error => {
        this.isCreatingGroup = false;
        this.notify.error(error.error.error_description, error.error.error);        
      }
    ); 
  }

  public getContactsOfGroup(event){
    this.selectedGroupId = event.target.value;
    this.groupService.getContactsOfGroup(this.selectedGroupId).subscribe(
      (response: any) => {
        this.groupContacts = response;
        //initialize the selected group
        this.selectedGroup = this.groups.find(group => {
          return group.id == this.selectedGroupId;
        })
        // cache our clients
        this.tempContacts = [...this.groupContacts];
        this.groups
      }, error => {
        this.notify.error(error.error);        
      }
    );
  }

  public openRemoveClientDialog(removeModal, contact: ContactDetails, rowIndex){
    this.removeContact = new ContactDetails(contact.id, contact.countryCode, 
      contact.phoneNumber, contact.teleCom);
    this.removeRow = rowIndex;
    this.removeModal = this.modalService.open(removeModal);
  }
  public changeEntriesPerPage(event){
    this.entriesPerPage = event.target.value;
  }

  public removeContactFromGroup(){    
    this.groupContacts.splice(this.removeRow, 1);
    this.contactService.removeContactFromGroup(this.removeContact.id, this.selectedGroup.id).subscribe(
      (response: any) => {
        this.notify.success(response.message, response.title);
      }, error =>{
        this.notify.error(error.error);        
      }
    );
    this.groupContacts = [...this.groupContacts];
    this.tempContacts = [...this.groupContacts];
    this.removeModal.close(); 
  }
public deleteGroup(form){
  this.groupService.deleteGroup(form.group).subscribe(
    (response:any) => {
      this.getGroups();
      this.notify.success(response.message, response.title);
    }, error =>{
      this.notify.error(error.error);        
    }
  );
}
}
