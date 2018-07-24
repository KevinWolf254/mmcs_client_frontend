import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../shared/models/user.model';
import { UserCredentials } from '../../shared/models/user-credentials.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { selectValidator } from '../../shared/validators/select-validator';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { UserService } from '../../../shared/services/user/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  public users: UserCredentials[] = [];
  deleteUser: UserCredentials;
  deleteRow: number = null;
  perPage: number;
  perPageNos: number[] = [10, 25, 50, 100];
  edit = {};
  email: string = '';
  form: FormGroup;
  modalRefDel: NgbModalRef;
  modalRefReset: NgbModalRef;

  temp = [];
  @ViewChild(DatatableComponent) table: DatatableComponent;
  
  // Custom icons for ngx-datatable
  customPagerIcons = {
    sortAscending: 'fa fa-sort-asc', sortDescending: 'fa fa-sort-desc', pagerLeftArrow: 'fa fa-chevron-left', 
    pagerRightArrow: 'fa fa-chevron-right', pagerPrevious: 'fa fa-step-backward', pagerNext: 'fa fa-step-forward'
  };

  constructor(private modalService: NgbModal, private _fb: FormBuilder, private userService: UserService) {
    this.form = _fb.group({
      'resetPass': [null,Validators.compose([Validators.required, Validators.minLength(4)])]
    });
  }

  ngOnInit() {
    this.getUsers();

    this.perPage = this.perPageNos[0];
  }

  // retrieves all users from server
  private getUsers(){

    let user: UserCredentials;
    // let date: string = (new Date().toISOString().slice(0,10));
    let date: Date = new Date();
    for(let i=1; i<=50; i++){ 
      user = new UserCredentials(i, 'User', ''+i, 'user'+i+'@company.com', 'Admin', true, date);
      this.users.push(user);
    }
    // cache our users
    this.temp = [...this.users];
  }

  editUser(rowIndex){
    this.edit[rowIndex] = true;
  }

  setFName(event, rowIndex){
    this.users[rowIndex]["firstName"] = event.target.value;
  }

  setLName(event, rowIndex){
    this.users[rowIndex]["lastName"] = event.target.value;
  }

  setRole(event, rowIndex){
    this.users[rowIndex].credentials.role = event.target.value;
  }

  updateUser(rowIndex){
    this.users = [...this.users];
    this.edit[rowIndex] = false;
  }
  
  openReset(modal, user, rowIndex){
    this.form.reset(); 
    this.modalRefReset = this.modalService.open(modal);
    this.email = user.email;
  }

  reset(form){
    console.log("User email: "+this.email);
    console.log("Reset Pass: "+form.resetPass);
    this.form.reset(); 
    this.modalRefReset.close();   
  }

  confirmDelete(modal, user, rowIndex){
    this.deleteUser = new UserCredentials(user.id, user.firstName, user.lastName, user.email, user.credentials.role, user.credentials.active, user.credentials.lastSignIn);
    this.deleteRow = rowIndex;    
    this.modalRefDel = this.modalService.open(modal);
  }

  delete(){
    this.users.splice(this.deleteRow, 1);
    this.users = [...this.users];
    this.modalRefDel.close(); 
  }

  changePageEntries(event){
    this.perPage = event.target.value;
  }

  search(event) {
    let searchParam = event.target.value.toLowerCase();

    // filter our data
    let temp = this.temp.filter(user => {
      return user.email.toLowerCase().indexOf(searchParam) !== -1 || !searchParam;
    });

    // update the rows
    this.users = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
}