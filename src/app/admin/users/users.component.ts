import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../shared/models/user.model';
import { UserCredentials } from '../../shared/models/user-credentials.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  private dtOptions: DataTables.Settings = {};
  private users: User[] = [];

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    this.getUsers();

    this.dtOptions = {
      pagingType: 'full_numbers'
    };
  }

  // retrieves all users from server
  private getUsers(){
    let user: User;
    for(let i=1; i<=100; i++){
      this.users.push(user = {id:i, firstName: 'user '+i, lastName: 'user', email: 'user'+i+'@company.co.ke', role: 'Admin'});
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
