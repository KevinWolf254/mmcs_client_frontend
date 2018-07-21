import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { selectValidator } from '../../../shared/validators/select-validator';
import { User } from '../../../shared/models/user.model';
import { UserService } from '../../../shared/services/user/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  userForm: FormGroup;
  roles: string[] = [];
  newUser: User;

  constructor(private _fb: FormBuilder) {
    this.userForm = _fb.group({
      'surname': [null], 
      'otherNames': [null],
      'role': ['0', Validators.compose([Validators.required, selectValidator])],
      'email': [null,Validators.compose([Validators.required, Validators.email])],
      'defaultPass': [null,Validators.compose([Validators.required, Validators.minLength(4)])]
    });
   }

  ngOnInit() {
    this.roles = ["Admin", "User"];
  }

  createUser(form){
    this.newUser = new User(0, form.firstName, form.lastName, form.email);
    let role = form.role;
    let defaultPass = form.defaultPass;
    this.userForm.reset();
  }
}

