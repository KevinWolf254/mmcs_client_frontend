import { Component, OnInit, AfterViewInit, Renderer } from '@angular/core';
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
export class UsersComponent implements AfterViewInit,  OnInit {

  private dtOptions: DataTables.Settings = {};
  private usersCredentials: UserCredentials[] = [];

  private form: FormGroup;


  constructor(private modalService: NgbModal,private renderer: Renderer, private _fb: FormBuilder) {
    
    this.form = this._fb.group({
      'firstName': [null,Validators.required],
      'lastName': [null,Validators.required],
      'role': ['0', selectValidator],
      'acntStatus': [null, Validators.required]
    });
  }

  ngOnInit() {
    this.getUsers();

    this.dtOptions = {
      pagingType: 'full_numbers',
      autoWidth: true,      
      data: this.usersCredentials,
      columns:[{
        title: '#', data: 'id'
      }, {
        title: 'First Name', data: 'firstName'
      }, {
        title: 'Last Name', data: 'lastName'
      },{
        title: 'Email', data: 'email'
      },{
        title: 'Account Status', data: 'credentials.active'
      },{
        title: 'SignedIn', data: 'credentials.lastSignIn'
      },{
        title: 'Actions', data: null, className: 'actions'
      }],
      columnDefs: [{
        targets: 4,
        render: function(data, type, full, meta){
          if(data == true){
            return '<button class="btn btn-sm btn-success" disabled type="button"><i class="fa fa-toggle-on fa-lg"></i> enabled</button>'
          }
          return '<button class="btn btn-sm btn-danger" disabled type="button"><i class="fa fa-toggle-off"></i> disabled</button>'
        }
      },{
        targets: 6,
        render: function(data, type, full, meta){   
            return  '<div class="btn-group" role="group" aria-label="Actions">'+
                      '<button onclick="edit($event)" class="btn btn-sm btn-outline-info" data-toggle="tooltip" data-placement="top" title="Edit user details"><i class="fa fa-pencil"></i></button>'+
                      '<button class="btn btn-sm btn-outline-warning" data-toggle="tooltip" data-placement="top" title="Reset user password"><i class="fa fa-repeat"></i></button>'+
                      '<button class="btn btn-sm btn-outline-danger" data-toggle="tooltip" data-placement="top" title="Delete user"><i class="fa fa-trash"></i></button>'+
                    '</div>'
        }
      }],
      // shows number of entries per page
      // pageLength: 2 
      responsive: true    
    };
  }

  ngAfterViewInit(): void {
    this.renderer.listenGlobal('document', 'click',(event) => {
      if (event.target.hasAttribute("actions")) {
        console.log(event);
      }
    })
  }

  // retrieves all users from server
  private getUsers(){
    let user: UserCredentials;
    for(let i=1; i<=100; i++){
      user = new UserCredentials(i, 'User', ''+i, 'user'+i+'@company.com', 'Admin', true, new Date());
      this.usersCredentials.push(user);
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
