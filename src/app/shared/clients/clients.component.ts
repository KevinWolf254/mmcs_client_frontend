import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { selectValidator } from '../validators/select-validator';
import { Group } from '../models/group.model';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {

  private form: FormGroup;
  private fileForm: FormGroup;
  private groups: Group[] = [];

  constructor(private _fb: FormBuilder) { 
    this.form = _fb.group({
      'group': ['0',selectValidator],
      'phone': [null,Validators.compose([Validators.required, Validators.pattern('^7[0-9]{8,8}')])],
    });
    this.fileForm = _fb.group({
      'group': ['0',selectValidator],
      'file': [null,Validators.required]
    });
  }

  ngOnInit() {
    this.getGroups();
  }

  private add(form){
    console.log(form.phone);
  }

  private addClients(form){

  }

  private check(phone){
    console.log(phone);
  }

  /*retrieves all groups from web service to select */
  private getGroups(){
    let receivedGroup: Group;
    for(let i=1; i<11; i++){
        receivedGroup = new Group(i, "Group "+i);
        this.groups.push(receivedGroup);
    } 
  } 
}
