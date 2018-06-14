import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../shared/models/user.model';
import { UserCredentials } from '../../shared/models/user-credentials.model';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  private dtOptions: DataTables.Settings = {};
  private usersCredentials: UserCredentials[] = [];


  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    this.getUsers();

    this.dtOptions = {
      pagingType: 'full_numbers'
    };
  }

  // retrieves all users from server
  private getUsers(){
    let user: UserCredentials;
    for(let i=1; i<=100; i++){
      user = new UserCredentials(i, 'User', ''+i, 'user'+i+'@company.com', 'Admin', true, new Date());
      this.usersCredentials.push(user);
    }
  }

  private edit(editModal, user: User){
    this.modalService.open(editModal);
    console.log("User ID: "+user.id);
  }

  private reset(resetModal, user){

  }

  private delete(deleteModal, user){

  }
}
