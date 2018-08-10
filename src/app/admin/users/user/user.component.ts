import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { selectValidator } from '../../../shared/validators/select-validator';
import { UserService } from '../../../shared/services/user/user.service';
import { ToastrService } from 'ngx-toastr';
import { Role } from '../../../shared/models/credentials.model';
import { _UserDetails } from '../../../shared/models/response.model';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  public userForm: FormGroup;
  public roles: string[] = [];
  public newUser: User;
  public adminUser: _UserDetails;
  public isCreating: boolean = false;

  constructor(private _fb: FormBuilder, private userService: UserService, private notify: ToastrService) {
    this.userForm = _fb.group({
      'surname': [null], 
      'otherNames': [null],
      'role': ['0', Validators.compose([Validators.required, selectValidator])],
      'email': [null,Validators.compose([Validators.required, Validators.email])],
      'defaultPass': [null,Validators.compose([Validators.required, Validators.minLength(4)])]
    });
   }

  ngOnInit() {
    this.roles = [Role.ADMIN, Role.USER];
  }

  public createUser(form){
    this.isCreating = true;
    this.userService.saveNewUser(form.surname, form.otherNames, form.email, form.role, form.defaultPass).subscribe(
      response =>{ 
        this.notify.success('Created user Successfully...');       
        this.userForm.reset();
        this.userForm.get("role").setValue(0);
        this.isCreating = false;
      },error =>{
        this.notify.error('User may already exist...');
        this.isCreating = false;
      }
    );
  }
}

