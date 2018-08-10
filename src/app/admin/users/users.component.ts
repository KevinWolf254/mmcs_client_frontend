import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { UserService } from '../../shared/services/user/user.service';
import { ToastrService } from 'ngx-toastr';
import { UnitsResponseSuccess } from '../../shared/models/response.model';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  // public users: UserCredentials[] = [];
  // public deleteUser: UserCredentials;

  public users: User[] = [];
  public deleteUser: User;

  public deleteRow: number = null;

  private deleteUserEmail: string = '';
  // private deleteUserId = null;
  public perPage: number;
  public perPageNos: number[] = [10, 25, 50, 100];
  public edit = {};
  public email: string = '';
  public modalRefDel: NgbModalRef;

  public temp = [];
  @ViewChild(DatatableComponent) table: DatatableComponent;
  
  // Custom icons for ngx-datatable
  customPagerIcons = {
    sortAscending: 'fa fa-sort-asc', sortDescending: 'fa fa-sort-desc', pagerLeftArrow: 'fa fa-chevron-left', 
    pagerRightArrow: 'fa fa-chevron-right', pagerPrevious: 'fa fa-step-backward', pagerNext: 'fa fa-step-forward'
  };

  constructor(private modalService: NgbModal, private userService: UserService, 
    private notify: ToastrService) {
  }

  ngOnInit() {
    this.getUsers();

    this.perPage = this.perPageNos[0];
  }

  private getUsers(){
    this.userService.getUsers().subscribe(
      (users: User[]) =>{
        this.users = users;
        // cache our users
        this.temp = [...users];
      }
    );
  }

  public editUser(rowIndex){
    this.edit[rowIndex] = true;
  }

  public setFName(event, rowIndex){
    this.users[rowIndex]["surname"] = event.target.value;
  }

  public setLName(event, rowIndex){
    this.users[rowIndex]["otherNames"] = event.target.value;
  }

  public setRole(event, rowIndex){
    this.users[rowIndex].role = event.target.value;
  }

  public updateUser(rowIndex){
    this.userService.updateUser(this.users[rowIndex]).subscribe(
      (userUpdated: User)=>{
        this.users[rowIndex] = userUpdated;        
        this.users = [...this.users];        
        this.edit[rowIndex] = false;
        this.notify.success("User was successfully updated...");
      },error=>{
        this.notify.error(error.error.error_description, error.error.error);
        this.getUsers();
        this.edit[rowIndex] = false;
      }
    );
  }

  public confirmDelete(modal, user: User, rowIndex){
    // this.deleteUser = new User(user.surname, user.otherNames, 
    //   user.email, user.role, user.isActive, user.lastSignInDate);
    this.deleteUser = user;
    
    this.deleteUserEmail = user.email;
    this.deleteRow = rowIndex;        
    this.modalRefDel = this.modalService.open(modal);
  }

  public delete(){
    this.userService.deletUser(this.deleteUserEmail).subscribe(
      (response: UnitsResponseSuccess) =>{             
        this.modalRefDel.close();
        this.users.splice(this.deleteRow, 1);
        this.users = [...this.users];
        this.notify.success(response.message, response.title);
      },error=>{
        this.notify.error(error.error.error_description, error.error.error);
      }
    );
  }

  public changePageEntries(event){
    this.perPage = event.target.value;
  }

  public search(event) {
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