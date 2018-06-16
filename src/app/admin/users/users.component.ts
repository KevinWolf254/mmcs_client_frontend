import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../shared/models/user.model';
import { UserCredentials } from '../../shared/models/user-credentials.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { selectValidator } from '../../shared/validators/select-validator';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  private users: UserCredentials[] = [];
  private perPage: number = 10;
  // private edit: boolean = false;
  private edit = {};
  
  // Custom icons for ngx-datatable
  private customPagerIcons = {
    sortAscending: 'fa fa-sort-asc', sortDescending: 'fa fa-sort-desc',
    pagerLeftArrow: 'fa fa-chevron-left', pagerRightArrow: 'fa fa-chevron-right',
    pagerPrevious: 'fa fa-step-backward', pagerNext: 'fa fa-step-forward'
  };

  constructor(private modalService: NgbModal) {}

  ngOnInit() {
    this.getUsers();
  }

  // retrieves all users from server
  private getUsers(){
    let user: UserCredentials;
    for(let i=1; i<=50; i++){
      user = new UserCredentials(i, 'User', ''+i, 'user'+i+'@company.com', 'Admin', true, new Date());
      this.users.push(user);
    }
  }

  private editUser(user, rowIndex){
    this.edit[rowIndex] = true;
  }

  // private edit(editModal, user: User){
  //   this.modalService.open(editModal);
  // }

  private reset(resetModal, user){

  }

  private delete(deleteModal, user){

  }
}
