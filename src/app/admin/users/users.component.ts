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

  private rows: UserCredentials[] = [];
  private columns = [{prop: 'id'}, {name: 'first name'}, {name: 'last name'}, {name: 'email'}, {name: 'role'}, {name: 'active'}, {name: 'last sign in'}]
  private perPage: number = 10;
  private form: FormGroup;


  constructor(private modalService: NgbModal, private _fb: FormBuilder) {
    
    this.form = this._fb.group({
      'firstName': [null,Validators.required],
      'lastName': [null,Validators.required],
      'role': ['0', selectValidator],
      'acntStatus': [null, Validators.required]
    });
  }

  ngOnInit() {
    this.getUsers();
  }

  // retrieves all users from server
  private getUsers(){
    let user: UserCredentials;
    for(let i=1; i<=100; i++){
      user = new UserCredentials(i, 'User', ''+i, 'user'+i+'@company.com', 'Admin', true, new Date());
      this.rows.push(user);
    }
  }

  private editUser(form){

  }

  private edit(editModal, user: User){
    this.modalService.open(editModal);
  }

  private reset(resetModal, user){

  }

  private delete(deleteModal, user){

  }
}
