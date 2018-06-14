import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { selectValidator } from '../../../shared/validators/select-validator';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  private userForm: FormGroup;
  private roles: string[] = [];

  constructor(private _fb: FormBuilder) {
    this.userForm = _fb.group({
      'firstName': [null],
      'lastName': [null],
      'role': ['0', Validators.compose([Validators.required, selectValidator])],
      'email': [null,Validators.compose([Validators.required, Validators.email])],
      'defaultPass': [null,Validators.compose([Validators.required, Validators.minLength(4)])]
    });
   }

  ngOnInit() {
    this.roles = ["Admin", "User"];
  }

  createUser(values){
    // create user
    console.log("firstName: "+values.firstName+
    " lastName: "+values.lastName+" role: "+values.role
    +" email: "+values.email+" defaultPass: "+values.defaultPass);
    this.userForm.reset();
  }
}

