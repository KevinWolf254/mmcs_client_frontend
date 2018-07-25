import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UserCredentials } from '../../shared/models/user-credentials.model';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { UserService } from '../../shared/services/user/user.service';
import { ToastrService } from '../../../../node_modules/ngx-toastr';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  public users: UserCredentials[] = [];
  public deleteUser: UserCredentials;
  public deleteRow: number = null;
  private deleteUserId = null;
  public perPage: number;
  public perPageNos: number[] = [10, 25, 50, 100];
  public edit = {};
  public email: string = '';
  // form: FormGroup;
  public modalRefDel: NgbModalRef;
  // modalRefReset: NgbModalRef;

  public temp = [];
  @ViewChild(DatatableComponent) table: DatatableComponent;
  
  // Custom icons for ngx-datatable
  customPagerIcons = {
    sortAscending: 'fa fa-sort-asc', sortDescending: 'fa fa-sort-desc', pagerLeftArrow: 'fa fa-chevron-left', 
    pagerRightArrow: 'fa fa-chevron-right', pagerPrevious: 'fa fa-step-backward', pagerNext: 'fa fa-step-forward'
  };

  constructor(private modalService: NgbModal, private userService: UserService, private notify: ToastrService) {
    // this.form = _fb.group({
    //   'resetPass': [null,Validators.compose([Validators.required, Validators.minLength(4)])]
    // });
  }

  ngOnInit() {
    this.getUsers();

    this.perPage = this.perPageNos[0];
  }

  private getUsers(){
    this.userService.getUsers().subscribe(
      (users: UserCredentials[]) =>{
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
    this.users[rowIndex].credentials.role = event.target.value;
  }

  public updateUser(rowIndex){
    this.userService.updateUser(this.users[rowIndex]).subscribe(
      (userUpdated: UserCredentials)=>{
        this.users[rowIndex] = userUpdated;        
        this.users = [...this.users];        
        this.edit[rowIndex] = false;
        this.notify.success("User was successfully updated...");
      },error=>{
        this.notify.error("Update failed...");
        this.getUsers();
        this.edit[rowIndex] = false;
      }
    );
  }
  
  // openReset(modal, user, rowIndex){
  //   this.form.reset(); 
  //   this.modalRefReset = this.modalService.open(modal);
  //   this.email = user.email;
  // }

  // reset(form){
  //   console.log("User email: "+this.email);
  //   console.log("Reset Pass: "+form.resetPass);
  //   this.form.reset(); 
  //   this.modalRefReset.close();   
  // }

  public confirmDelete(modal, user, rowIndex){
    this.deleteUser = new UserCredentials(user.id, user.surname, user.otherNames, 
      user.email, user.credentials.role, user.credentials.active, user.credentials.lastSignIn);
      
    this.deleteUserId = user.id;
    this.deleteRow = rowIndex;        
    this.modalRefDel = this.modalService.open(modal);
  }

  public delete(){
    this.userService.deletUser(this.deleteUserId).subscribe(
      response=>{             
        this.modalRefDel.close();
        this.users.splice(this.deleteRow, 1);
        this.users = [...this.users];
        this.notify.success("Deleted");
      },error=>{
        this.notify.error("Deletion failed");
      }
    );
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